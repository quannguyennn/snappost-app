import { ApolloClient, InMemoryCache, fromPromise, HttpLink, from, Observable, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { API_URL } from '../environment/env';
import { storage, removeToken } from '../helpers/storage';
import possibleTypes from './possibleTypes.json';

const getNewToken = async () => {
  const refreshToken = await storage.get('refreshToken');
  if (!refreshToken) {
    return '';
  }
  try {
    // get new token
    // const res = await client.mutate<RefreshTokenMutationResponse, RefreshTokenMutationVariables>({
    //   mutation: RefreshTokenDocument,
    //   variables: {
    //     refreshToken: refreshToken,
    //   },
    // });

    // if (res.data) {
    //   await saveToken({
    //     accessToken: res.data?.refreshToken.accessToken || '',
    //     refreshToken: res.data?.refreshToken?.refreshToken || '',
    //   });
    //   return res.data?.refreshToken?.accessToken;
    // }
    return '';
  } catch (err) {
    await removeToken();
    return '';
  }
};

let isRefreshing = false;
let pendingRequests: Function[] = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    const { extensions } = graphQLErrors[0];

    switch (extensions?.code) {
      case 'UNAUTHENTICATED':
        // error code is set to UNAUTHENTICATED
        // when AuthenticationError thrown in resolver
        let forward$: Observable<any>;

        if (!isRefreshing) {
          isRefreshing = true;
          forward$ = fromPromise(
            getNewToken()
              .then((accessToken) => {
                const oldHeaders = operation.getContext().headers;
                operation.setContext(() => {
                  return {
                    headers: {
                      ...oldHeaders,
                      authorization: accessToken ? `Bearer ${accessToken}` : '',
                    },
                  };
                });
                // Store the new tokens for your auth link
                resolvePendingRequests();
                return accessToken;
              })
              .catch((error) => {
                pendingRequests = [];
                // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
              })
              .finally(() => {
                isRefreshing = false;
              }),
          );
        } else {
          // Will only emit once the Promise is resolved
          forward$ = fromPromise(
            new Promise((resolve) => {
              pendingRequests.push(() => resolve());
            }),
          );
        }

        return forward$.flatMap(() => forward(operation));
    }
  }
  if (networkError) {
    // console.log(`[Network error]: ${networkError}`);
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
  }
});

const httpLink = new HttpLink({
  uri: API_URL,
  includeExtensions: true,
});

const authMiddleware = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await storage.get('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
// setup websocket link
export const wsLink = new WebSocketLink({
  uri: API_URL,
  options: {
    reconnect: true,
    lazy: true,
    timeout: 1000,
    connectionParams: async () => {
      const token = await storage.get('accessToken');
      return {
        authorization: token ? `Bearer ${token}` : null,
      };
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  from([errorLink, authMiddleware, httpLink]),
);

// setup your client
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    possibleTypes: possibleTypes.possibleTypes,
  }),
  queryDeduplication: true,
  name: 'mobile',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
});
