import type * as Types from '../type.interface';

import type { UserFragmentFragment } from '../fragments/UserFragment.generated';
import { gql } from '@apollo/client';
import { UserFragmentFragmentDoc } from '../fragments/UserFragment.generated';
import * as Apollo from '@apollo/client';
export type LoginWithSnsMutationVariables = Types.Exact<{
  input: Types.NewUserInput;
}>;

export type LoginWithSnsMutationResponse = { __typename?: 'Mutation' } & {
  loginWithSNS: { __typename?: 'AuthConnection' } & Pick<Types.AuthConnection, 'accessToken' | 'refreshToken'> & {
      user: { __typename?: 'User' } & UserFragmentFragment;
    };
};

export const LoginWithSnsDocument = gql`
  mutation loginWithSNS($input: NewUserInput!) {
    loginWithSNS(input: $input) {
      accessToken
      refreshToken
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragmentFragmentDoc}
`;
export function useLoginWithSnsMutation(
  baseOptions?: Apollo.MutationHookOptions<LoginWithSnsMutationResponse, LoginWithSnsMutationVariables>,
) {
  return Apollo.useMutation<LoginWithSnsMutationResponse, LoginWithSnsMutationVariables>(
    LoginWithSnsDocument,
    baseOptions,
  );
}
export type LoginWithSnsMutationHookResult = ReturnType<typeof useLoginWithSnsMutation>;
export type LoginWithSnsMutationResult = Apollo.MutationResult<LoginWithSnsMutationResponse>;
export type LoginWithSnsMutationOptions = Apollo.BaseMutationOptions<
  LoginWithSnsMutationResponse,
  LoginWithSnsMutationVariables
>;
