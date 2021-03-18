import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type RemovePostMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type RemovePostMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'removePost'>;

export const RemovePostDocument = gql`
  mutation removePost($id: Float!) {
    removePost(id: $id)
  }
`;
export function useRemovePostMutation(
  baseOptions?: Apollo.MutationHookOptions<RemovePostMutationResponse, RemovePostMutationVariables>,
) {
  return Apollo.useMutation<RemovePostMutationResponse, RemovePostMutationVariables>(RemovePostDocument, baseOptions);
}
export type RemovePostMutationHookResult = ReturnType<typeof useRemovePostMutation>;
export type RemovePostMutationResult = Apollo.MutationResult<RemovePostMutationResponse>;
export type RemovePostMutationOptions = Apollo.BaseMutationOptions<
  RemovePostMutationResponse,
  RemovePostMutationVariables
>;
