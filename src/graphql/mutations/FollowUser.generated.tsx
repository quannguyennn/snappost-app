import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type FollowUserMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type FollowUserMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'FollowUser'>;

export const FollowUserDocument = gql`
  mutation FollowUser($id: Float!) {
    FollowUser(id: $id)
  }
`;
export function useFollowUserMutation(
  baseOptions?: Apollo.MutationHookOptions<FollowUserMutationResponse, FollowUserMutationVariables>,
) {
  return Apollo.useMutation<FollowUserMutationResponse, FollowUserMutationVariables>(FollowUserDocument, baseOptions);
}
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutationResponse>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<
  FollowUserMutationResponse,
  FollowUserMutationVariables
>;
