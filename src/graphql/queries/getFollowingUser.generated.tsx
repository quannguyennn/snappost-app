import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetFollowingUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetFollowingUserQueryResponse = { __typename?: 'Query' } & {
  getFollowingUser: Array<
    { __typename?: 'User' } & Pick<
      Types.User,
      | 'id'
      | 'name'
      | 'nickname'
      | 'intro'
      | 'zaloId'
      | 'avatar'
      | 'isNew'
      | 'blocked'
      | 'lastSeen'
      | 'createdAt'
      | 'updatedAt'
      | 'avatarFilePath'
      | 'isRequestFollowMe'
      | 'isBlockMe'
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
              | 'blocked'
              | 'lastSeen'
              | 'createdAt'
              | 'updatedAt'
              | 'avatarFilePath'
              | 'isRequestFollowMe'
              | 'isBlockMe'
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
                      | 'blocked'
                      | 'lastSeen'
                      | 'createdAt'
                      | 'updatedAt'
                      | 'avatarFilePath'
                      | 'isRequestFollowMe'
                      | 'isBlockMe'
                      | 'followStatus'
                    > & {
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
                              | 'blocked'
                              | 'lastSeen'
                              | 'createdAt'
                              | 'updatedAt'
                              | 'avatarFilePath'
                              | 'isRequestFollowMe'
                              | 'isBlockMe'
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
                                      | 'blocked'
                                      | 'lastSeen'
                                      | 'createdAt'
                                      | 'updatedAt'
                                      | 'avatarFilePath'
                                      | 'isRequestFollowMe'
                                      | 'isBlockMe'
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
                                      | 'blocked'
                                      | 'lastSeen'
                                      | 'createdAt'
                                      | 'updatedAt'
                                      | 'avatarFilePath'
                                      | 'isRequestFollowMe'
                                      | 'isBlockMe'
                                      | 'followStatus'
                                    >
                                  >
                                >;
                              }
                          >
                        >;
                      }
                  >
                >;
              }
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
              | 'blocked'
              | 'lastSeen'
              | 'createdAt'
              | 'updatedAt'
              | 'avatarFilePath'
              | 'isRequestFollowMe'
              | 'isBlockMe'
              | 'followStatus'
            >
          >
        >;
      }
  >;
};

export const GetFollowingUserDocument = gql`
  query getFollowingUser {
    getFollowingUser {
      id
      name
      nickname
      intro
      zaloId
      avatar
      isNew
      blocked
      lastSeen
      createdAt
      updatedAt
      avatarFilePath
      isRequestFollowMe
      isBlockMe
      followStatus
      nFollowing {
        id
        name
        nickname
        intro
        zaloId
        avatar
        isNew
        blocked
        lastSeen
        createdAt
        updatedAt
        avatarFilePath
        isRequestFollowMe
        isBlockMe
        followStatus
        nFollowing {
          id
          name
          nickname
          intro
          zaloId
          avatar
          isNew
          blocked
          lastSeen
          createdAt
          updatedAt
          avatarFilePath
          isRequestFollowMe
          isBlockMe
          followStatus
          nFollower {
            id
            name
            nickname
            intro
            zaloId
            avatar
            isNew
            blocked
            lastSeen
            createdAt
            updatedAt
            avatarFilePath
            isRequestFollowMe
            isBlockMe
            followStatus
            nFollowing {
              id
              name
              nickname
              intro
              zaloId
              avatar
              isNew
              blocked
              lastSeen
              createdAt
              updatedAt
              avatarFilePath
              isRequestFollowMe
              isBlockMe
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
              blocked
              lastSeen
              createdAt
              updatedAt
              avatarFilePath
              isRequestFollowMe
              isBlockMe
              followStatus
            }
          }
        }
      }
      nFollower {
        id
        name
        nickname
        intro
        zaloId
        avatar
        isNew
        blocked
        lastSeen
        createdAt
        updatedAt
        avatarFilePath
        isRequestFollowMe
        isBlockMe
        followStatus
      }
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
