import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CountUnSeenNotificationQueryVariables = Types.Exact<{ [key: string]: never }>;

export type CountUnSeenNotificationQueryResponse = { __typename?: 'Query' } & Pick<
  Types.Query,
  'countUnSeenNotification'
>;

export const CountUnSeenNotificationDocument = gql`
  query countUnSeenNotification {
    countUnSeenNotification
  }
`;
export function useCountUnSeenNotificationQuery(
  baseOptions?: Apollo.QueryHookOptions<CountUnSeenNotificationQueryResponse, CountUnSeenNotificationQueryVariables>,
) {
  return Apollo.useQuery<CountUnSeenNotificationQueryResponse, CountUnSeenNotificationQueryVariables>(
    CountUnSeenNotificationDocument,
    baseOptions,
  );
}
export function useCountUnSeenNotificationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CountUnSeenNotificationQueryResponse,
    CountUnSeenNotificationQueryVariables
  >,
) {
  return Apollo.useLazyQuery<CountUnSeenNotificationQueryResponse, CountUnSeenNotificationQueryVariables>(
    CountUnSeenNotificationDocument,
    baseOptions,
  );
}
export type CountUnSeenNotificationQueryHookResult = ReturnType<typeof useCountUnSeenNotificationQuery>;
export type CountUnSeenNotificationLazyQueryHookResult = ReturnType<typeof useCountUnSeenNotificationLazyQuery>;
export type CountUnSeenNotificationQueryResult = Apollo.QueryResult<
  CountUnSeenNotificationQueryResponse,
  CountUnSeenNotificationQueryVariables
>;
