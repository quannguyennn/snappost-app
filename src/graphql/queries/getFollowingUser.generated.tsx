import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetFollowingUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetFollowingUserQueryResponse = { __typename?: 'Query' } & {
  getFollowingUser: Array<
    { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'lastSeen' | 'avatarFilePath'>
  >;
};

export const GetFollowingUserDocument = gql`
  query getFollowingUser {
    getFollowingUser {
      id
      name
      nickname
      lastSeen
      avatarFilePath
    }
  }
`;
export function useGetFollowingUserQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFollowingUserQueryResponse, GetFollowingUserQueryVariables>,
) {
  return Apollo.useQuery<GetFollowingUserQueryResponse, GetFollowingUserQueryVariables>(
    GetFollowingUserDocument,
    baseOptions,
  );
}
export function useGetFollowingUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingUserQueryResponse, GetFollowingUserQueryVariables>,
) {
  return Apollo.useLazyQuery<GetFollowingUserQueryResponse, GetFollowingUserQueryVariables>(
    GetFollowingUserDocument,
    baseOptions,
  );
}
export type GetFollowingUserQueryHookResult = ReturnType<typeof useGetFollowingUserQuery>;
export type GetFollowingUserLazyQueryHookResult = ReturnType<typeof useGetFollowingUserLazyQuery>;
export type GetFollowingUserQueryResult = Apollo.QueryResult<
  GetFollowingUserQueryResponse,
  GetFollowingUserQueryVariables
>;
