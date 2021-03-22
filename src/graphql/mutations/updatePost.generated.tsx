import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UpdatePostMutationVariables = Types.Exact<{
  input: Types.UpdatePostInput;
}>;

export type UpdatePostMutationResponse = { __typename?: 'Mutation' } & {
  updatePost: { __typename?: 'Post' } & Pick<Types.Post, 'id'>;
};

export const UpdatePostDocument = gql`
  mutation updatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
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
