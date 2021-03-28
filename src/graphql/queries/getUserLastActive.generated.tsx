import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetUserLasActiveQueryVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type GetUserLasActiveQueryResponse = { __typename?: 'Query' } & {
  getUserInfo?: Types.Maybe<{ __typename?: 'User' } & Pick<Types.User, 'id' | 'lastSeen'>>;
};

export const GetUserLasActiveDocument = gql`
  query getUserLasActive($id: Float!) {
    getUserInfo(id: $id) {
      id
      lastSeen
    }
  }
`;
export function useGetUserLasActiveQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserLasActiveQueryResponse, GetUserLasActiveQueryVariables>,
) {
  return Apollo.useQuery<GetUserLasActiveQueryResponse, GetUserLasActiveQueryVariables>(
    GetUserLasActiveDocument,
    baseOptions,
  );
}
export function useGetUserLasActiveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserLasActiveQueryResponse, GetUserLasActiveQueryVariables>,
) {
  return Apollo.useLazyQuery<GetUserLasActiveQueryResponse, GetUserLasActiveQueryVariables>(
    GetUserLasActiveDocument,
    baseOptions,
  );
}
export type GetUserLasActiveQueryHookResult = ReturnType<typeof useGetUserLasActiveQuery>;
export type GetUserLasActiveLazyQueryHookResult = ReturnType<typeof useGetUserLasActiveLazyQuery>;
export type GetUserLasActiveQueryResult = Apollo.QueryResult<
  GetUserLasActiveQueryResponse,
  GetUserLasActiveQueryVariables
>;
