import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UnFollowUserMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type UnFollowUserMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'UnFollowUser'>;

export const UnFollowUserDocument = gql`
  mutation UnFollowUser($id: Float!) {
    UnFollowUser(id: $id)
  }
`;
export function useUnFollowUserMutation(
  baseOptions?: Apollo.MutationHookOptions<UnFollowUserMutationResponse, UnFollowUserMutationVariables>,
) {
  return Apollo.useMutation<UnFollowUserMutationResponse, UnFollowUserMutationVariables>(
    UnFollowUserDocument,
    baseOptions,
  );
}
export type UnFollowUserMutationHookResult = ReturnType<typeof useUnFollowUserMutation>;
export type UnFollowUserMutationResult = Apollo.MutationResult<UnFollowUserMutationResponse>;
export type UnFollowUserMutationOptions = Apollo.BaseMutationOptions<
  UnFollowUserMutationResponse,
  UnFollowUserMutationVariables
>;
