import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ReactToPostMutationVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type ReactToPostMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'reactToPost'>;

export const ReactToPostDocument = gql`
  mutation reactToPost($postId: Float!) {
    reactToPost(postId: $postId)
  }
`;
export function useReactToPostMutation(
  baseOptions?: Apollo.MutationHookOptions<ReactToPostMutationResponse, ReactToPostMutationVariables>,
) {
  return Apollo.useMutation<ReactToPostMutationResponse, ReactToPostMutationVariables>(
    ReactToPostDocument,
    baseOptions,
  );
}
export type ReactToPostMutationHookResult = ReturnType<typeof useReactToPostMutation>;
export type ReactToPostMutationResult = Apollo.MutationResult<ReactToPostMutationResponse>;
export type ReactToPostMutationOptions = Apollo.BaseMutationOptions<
  ReactToPostMutationResponse,
  ReactToPostMutationVariables
>;
