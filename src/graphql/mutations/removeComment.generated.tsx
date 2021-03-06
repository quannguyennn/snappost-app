import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type RemoveCommentMutationVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
  id: Types.Scalars['Float'];
}>;

export type RemoveCommentMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'removeComment'>;

export const RemoveCommentDocument = gql`
  mutation removeComment($postId: Float!, $id: Float!) {
    removeComment(postId: $postId, id: $id)
  }
`;
export function useRemoveCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<RemoveCommentMutationResponse, RemoveCommentMutationVariables>,
) {
  return Apollo.useMutation<RemoveCommentMutationResponse, RemoveCommentMutationVariables>(
    RemoveCommentDocument,
    baseOptions,
  );
}
export type RemoveCommentMutationHookResult = ReturnType<typeof useRemoveCommentMutation>;
export type RemoveCommentMutationResult = Apollo.MutationResult<RemoveCommentMutationResponse>;
export type RemoveCommentMutationOptions = Apollo.BaseMutationOptions<
  RemoveCommentMutationResponse,
  RemoveCommentMutationVariables
>;
