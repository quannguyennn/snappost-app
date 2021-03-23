import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CountFollowRequestQueryVariables = Types.Exact<{ [key: string]: never }>;

export type CountFollowRequestQueryResponse = { __typename?: 'Query' } & Pick<Types.Query, 'countFollowRequest'>;

export const CountFollowRequestDocument = gql`
  query countFollowRequest {
    countFollowRequest
  }
`;
export function useCountFollowRequestQuery(
  baseOptions?: Apollo.QueryHookOptions<CountFollowRequestQueryResponse, CountFollowRequestQueryVariables>,
) {
  return Apollo.useQuery<CountFollowRequestQueryResponse, CountFollowRequestQueryVariables>(
    CountFollowRequestDocument,
    baseOptions,
  );
}
export function useCountFollowRequestLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CountFollowRequestQueryResponse, CountFollowRequestQueryVariables>,
) {
  return Apollo.useLazyQuery<CountFollowRequestQueryResponse, CountFollowRequestQueryVariables>(
    CountFollowRequestDocument,
    baseOptions,
  );
}
export type CountFollowRequestQueryHookResult = ReturnType<typeof useCountFollowRequestQuery>;
export type CountFollowRequestLazyQueryHookResult = ReturnType<typeof useCountFollowRequestLazyQuery>;
export type CountFollowRequestQueryResult = Apollo.QueryResult<
  CountFollowRequestQueryResponse,
  CountFollowRequestQueryVariables
>;
