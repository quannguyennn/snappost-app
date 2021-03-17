import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetPostDetailQueryVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type GetPostDetailQueryResponse = { __typename?: 'Query' } & {
  getPostDetail: { __typename?: 'Post' } & Pick<
    Types.Post,
    'id' | 'creatorId' | 'medias' | 'caption' | 'rawCaption' | 'createdAt' | 'updatedAt' | 'totalLike' | 'isLike'
  > & {
      postComments?: Types.Maybe<
        Array<
          { __typename?: 'Comments' } & Pick<
            Types.Comments,
            'id' | 'creatorId' | 'postId' | 'parentId' | 'content' | 'createdAt' | 'updatedAt'
          >
        >
      >;
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
            | 'ownerId'
            | 'type'
            | 'createdAt'
            | 'updatedAt'
          > & {
              owner?: Types.Maybe<
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
              capabilities?: Types.Maybe<
                { __typename?: 'MediaCapability' } & Pick<
                  Types.MediaCapability,
                  'canCopy' | 'canDelete' | 'canDownload' | 'canEdit' | 'canRename'
                >
              >;
            }
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
};

export const GetPostDetailDocument = gql`
  query getPostDetail($id: Float!) {
    getPostDetail(id: $id) {
      id
      creatorId
      medias
      caption
      rawCaption
      createdAt
      updatedAt
      postComments {
        id
        creatorId
        postId
        parentId
        content
        createdAt
        updatedAt
      }
      totalLike
      isLike
      mediasPath {
        id
        fileSize
        name
        filePath
        mimeType
        isDeleted
        ownerId
        type
        createdAt
        updatedAt
        owner {
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
        capabilities {
          canCopy
          canDelete
          canDownload
          canEdit
          canRename
        }
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
`;
export function useGetPostDetailQuery(
  baseOptions: Apollo.QueryHookOptions<GetPostDetailQueryResponse, GetPostDetailQueryVariables>,
) {
  return Apollo.useQuery<GetPostDetailQueryResponse, GetPostDetailQueryVariables>(GetPostDetailDocument, baseOptions);
}
export function useGetPostDetailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPostDetailQueryResponse, GetPostDetailQueryVariables>,
) {
  return Apollo.useLazyQuery<GetPostDetailQueryResponse, GetPostDetailQueryVariables>(
    GetPostDetailDocument,
    baseOptions,
  );
}
export type GetPostDetailQueryHookResult = ReturnType<typeof useGetPostDetailQuery>;
export type GetPostDetailLazyQueryHookResult = ReturnType<typeof useGetPostDetailLazyQuery>;
export type GetPostDetailQueryResult = Apollo.QueryResult<GetPostDetailQueryResponse, GetPostDetailQueryVariables>;
