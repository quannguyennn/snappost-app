import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetUserInfoQueryVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type GetUserInfoQueryResponse = { __typename?: 'Query' } & {
  getUserInfo?: Types.Maybe<
    { __typename?: 'User' } & Pick<
      Types.User,
      | 'id'
      | 'name'
      | 'nickname'
      | 'intro'
      | 'zaloId'
      | 'avatar'
      | 'isNew'
      | 'createdAt'
      | 'updatedAt'
      | 'avatarFilePath'
      | 'followStatus'
    > & {
        nFollowing?: Types.Maybe<
          Array<
            { __typename?: 'User' } & Pick<
              Types.User,
              | 'id'
              | 'name'
              | 'nickname'
              | 'intro'
              | 'zaloId'
              | 'avatar'
              | 'isNew'
              | 'createdAt'
              | 'updatedAt'
              | 'avatarFilePath'
              | 'followStatus'
            >
          >
        >;
        nFollower?: Types.Maybe<
          Array<
            { __typename?: 'User' } & Pick<
              Types.User,
              | 'id'
              | 'name'
              | 'nickname'
              | 'intro'
              | 'zaloId'
              | 'avatar'
              | 'isNew'
              | 'createdAt'
              | 'updatedAt'
              | 'avatarFilePath'
              | 'followStatus'
            >
          >
        >;
      }
  >;
};

export const GetUserInfoDocument = gql`
  query getUserInfo($id: Float!) {
    getUserInfo(id: $id) {
      id
      name
      nickname
      intro
      zaloId
      avatar
      isNew
      createdAt
      updatedAt
      avatarFilePath
      followStatus
      nFollowing {
        id
        name
        nickname
        intro
        zaloId
        avatar
        isNew
        createdAt
        updatedAt
        avatarFilePath
        followStatus
      }
      nFollower {
        id
        name
        nickname
        intro
        zaloId
        avatar
        isNew
        createdAt
        updatedAt
        avatarFilePath
        followStatus
      }
    }
  }
`;
export function useGetUserInfoQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserInfoQueryResponse, GetUserInfoQueryVariables>,
) {
  return Apollo.useQuery<GetUserInfoQueryResponse, GetUserInfoQueryVariables>(GetUserInfoDocument, baseOptions);
}
export function useGetUserInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserInfoQueryResponse, GetUserInfoQueryVariables>,
) {
  return Apollo.useLazyQuery<GetUserInfoQueryResponse, GetUserInfoQueryVariables>(GetUserInfoDocument, baseOptions);
}
export type GetUserInfoQueryHookResult = ReturnType<typeof useGetUserInfoQuery>;
export type GetUserInfoLazyQueryHookResult = ReturnType<typeof useGetUserInfoLazyQuery>;
export type GetUserInfoQueryResult = Apollo.QueryResult<GetUserInfoQueryResponse, GetUserInfoQueryVariables>;
