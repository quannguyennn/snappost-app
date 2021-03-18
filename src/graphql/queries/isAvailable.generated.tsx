import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type IsAvailableQueryVariables = Types.Exact<{
  nickname: Types.Scalars['String'];
}>;

export type IsAvailableQueryResponse = { __typename?: 'Query' } & Pick<Types.Query, 'isAvailable'>;

export const IsAvailableDocument = gql`
  query isAvailable($nickname: String!) {
    isAvailable(nickname: $nickname)
  }
`;
export function useIsAvailableQuery(
  baseOptions: Apollo.QueryHookOptions<IsAvailableQueryResponse, IsAvailableQueryVariables>,
) {
  return Apollo.useQuery<IsAvailableQueryResponse, IsAvailableQueryVariables>(IsAvailableDocument, baseOptions);
}
export function useIsAvailableLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<IsAvailableQueryResponse, IsAvailableQueryVariables>,
) {
  return Apollo.useLazyQuery<IsAvailableQueryResponse, IsAvailableQueryVariables>(IsAvailableDocument, baseOptions);
}
export type IsAvailableQueryHookResult = ReturnType<typeof useIsAvailableQuery>;
export type IsAvailableLazyQueryHookResult = ReturnType<typeof useIsAvailableLazyQuery>;
export type IsAvailableQueryResult = Apollo.QueryResult<IsAvailableQueryResponse, IsAvailableQueryVariables>;
