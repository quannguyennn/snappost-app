import type * as Types from '../type.interface';

import type { UserFragmentFragment } from '../fragments/UserFragment.generated';
import { gql } from '@apollo/client';
import { UserFragmentFragmentDoc } from '../fragments/UserFragment.generated';
import * as Apollo from '@apollo/client';
export type UpdateUserInfoMutationVariables = Types.Exact<{
  input: Types.UpdateUserInput;
}>;

export type UpdateUserInfoMutationResponse = { __typename?: 'Mutation' } & {
  updateUserInfo: { __typename?: 'User' } & UserFragmentFragment;
};

export const UpdateUserInfoDocument = gql`
  mutation updateUserInfo($input: UpdateUserInput!) {
    updateUserInfo(input: $input) {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;
export function useUpdateUserInfoMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateUserInfoMutationResponse, UpdateUserInfoMutationVariables>,
) {
  return Apollo.useMutation<UpdateUserInfoMutationResponse, UpdateUserInfoMutationVariables>(
    UpdateUserInfoDocument,
    baseOptions,
  );
}
export type UpdateUserInfoMutationHookResult = ReturnType<typeof useUpdateUserInfoMutation>;
export type UpdateUserInfoMutationResult = Apollo.MutationResult<UpdateUserInfoMutationResponse>;
export type UpdateUserInfoMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserInfoMutationResponse,
  UpdateUserInfoMutationVariables
>;
