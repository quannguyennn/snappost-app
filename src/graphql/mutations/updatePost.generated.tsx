import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UpdatePostMutationVariables = Types.Exact<{
  input: Types.UpdatePostInput;
}>;

export type UpdatePostMutationResponse = { __typename?: 'Mutation' } & {
  updatePost: { __typename?: 'Post' } & Pick<
    Types.Post,
    'id' | 'creatorId' | 'medias' | 'caption' | 'rawCaption' | 'createdAt' | 'updatedAt' | 'totalLike' | 'isLike'
  > & {
      mediasPath?: Types.Maybe<
        Array<
          { __typename?: 'Media' } & Pick<
            Types.Media,
            'id' | 'fileSize' | 'name' | 'filePath' | 'mimeType' | 'isDeleted' | 'type' | 'createdAt' | 'updatedAt'
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
    };
};

export const UpdatePostDocument = gql`
  mutation updatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
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
  }
`;
export function useUpdatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdatePostMutationResponse, UpdatePostMutationVariables>,
) {
  return Apollo.useMutation<UpdatePostMutationResponse, UpdatePostMutationVariables>(UpdatePostDocument, baseOptions);
}
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutationResponse>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<
  UpdatePostMutationResponse,
  UpdatePostMutationVariables
>;
