import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetExplorePostQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
}>;

export type GetExplorePostQueryResponse = { __typename?: 'Query' } & {
  getExplorePost: { __typename?: 'PostConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Post' } & Pick<
          Types.Post,
          'id' | 'creatorId' | 'medias' | 'caption' | 'rawCaption' | 'createdAt' | 'updatedAt' | 'totalLike' | 'isLike'
        > & {
            mediasPath?: Types.Maybe<
              Array<
                { __typename?: 'Media' } & Pick<
                  Types.Media,
                  | 'id'
                  | 'fileSize'
                  | 'name'
                  | 'filePath'
                  | 'mimeType'
                  | 'isDeleted'
                  | 'type'
                  | 'createdAt'
                  | 'updatedAt'
                >
              >
            >;
            creatorInfo?: Types.Maybe<
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
                    >
                  >;
                }
            >;
          }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const GetExplorePostDocument = gql`
  query getExplorePost($page: Float!, $limit: Float!) {
    getExplorePost(page: $page, limit: $limit) {
      items {
        id
        creatorId
        medias
        caption
        rawCaption
        createdAt
        updatedAt
        totalLike
        isLike
        mediasPath {
          id
          fileSize
          name
          filePath
          mimeType
          isDeleted
          type
          createdAt
          updatedAt
        }
        creatorInfo {
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
      }
      meta {
        itemCount
        totalItems
        itemsPerPage
        totalPages
        currentPage
      }
    }
  }
`;
export function useGetExplorePostQuery(
  baseOptions: Apollo.QueryHookOptions<GetExplorePostQueryResponse, GetExplorePostQueryVariables>,
) {
  return Apollo.useQuery<GetExplorePostQueryResponse, GetExplorePostQueryVariables>(
    GetExplorePostDocument,
    baseOptions,
  );
}
export function useGetExplorePostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExplorePostQueryResponse, GetExplorePostQueryVariables>,
) {
  return Apollo.useLazyQuery<GetExplorePostQueryResponse, GetExplorePostQueryVariables>(
    GetExplorePostDocument,
    baseOptions,
  );
}
export type GetExplorePostQueryHookResult = ReturnType<typeof useGetExplorePostQuery>;
export type GetExplorePostLazyQueryHookResult = ReturnType<typeof useGetExplorePostLazyQuery>;
export type GetExplorePostQueryResult = Apollo.QueryResult<GetExplorePostQueryResponse, GetExplorePostQueryVariables>;
