import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CreateCommentMutationVariables = Types.Exact<{
  input: Types.CreateCommentInput;
}>;

export type CreateCommentMutationResponse = { __typename?: 'Mutation' } & {
  createComment: { __typename?: 'Comments' } & Pick<
    Types.Comments,
    'id' | 'creatorId' | 'postId' | 'parentId' | 'content' | 'createdAt' | 'updatedAt'
  > & {
      creatorInfo: { __typename?: 'User' } & Pick<
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
        };
    };
};

export const CreateCommentDocument = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      creatorId
      postId
      parentId
      content
      createdAt
      updatedAt
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
export function useCreateCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateCommentMutationResponse, CreateCommentMutationVariables>,
) {
  return Apollo.useMutation<CreateCommentMutationResponse, CreateCommentMutationVariables>(
    CreateCommentDocument,
    baseOptions,
  );
}
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutationResponse>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<
  CreateCommentMutationResponse,
  CreateCommentMutationVariables
>;
