import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type LogoutMutationVariables = Types.Exact<{ [key: string]: never }>;

export type LogoutMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'logout'>;

export const LogoutDocument = gql`
  mutation logout {
    logout
  }
`;
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<LogoutMutationResponse, LogoutMutationVariables>,
) {
  return Apollo.useMutation<LogoutMutationResponse, LogoutMutationVariables>(LogoutDocument, baseOptions);
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutationResponse>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutationResponse, LogoutMutationVariables>;
