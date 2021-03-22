import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CreateCommentMutationVariables = Types.Exact<{
  input: Types.CreateCommentInput;
}>;

export type CreateCommentMutationResponse = { __typename?: 'Mutation' } & {
  createComment: { __typename?: 'Comments' } & Pick<Types.Comments, 'id' | 'content' | 'createdAt'> & {
      creatorInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'>;
    };
};

export const CreateCommentDocument = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      createdAt
      creatorInfo {
        id
        name
        nickname
        avatarFilePath
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
