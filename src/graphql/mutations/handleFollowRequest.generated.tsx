import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type HandleFollowRequestMutationVariables = Types.Exact<{
  accept: Types.Scalars['Boolean'];
  userId: Types.Scalars['Float'];
}>;

export type HandleFollowRequestMutationResponse = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'handleFollowRequest'
>;

export const HandleFollowRequestDocument = gql`
  mutation handleFollowRequest($accept: Boolean!, $userId: Float!) {
    handleFollowRequest(accept: $accept, userId: $userId)
  }
`;
export function useHandleFollowRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<HandleFollowRequestMutationResponse, HandleFollowRequestMutationVariables>,
) {
  return Apollo.useMutation<HandleFollowRequestMutationResponse, HandleFollowRequestMutationVariables>(
    HandleFollowRequestDocument,
    baseOptions,
  );
}
export type HandleFollowRequestMutationHookResult = ReturnType<typeof useHandleFollowRequestMutation>;
export type HandleFollowRequestMutationResult = Apollo.MutationResult<HandleFollowRequestMutationResponse>;
export type HandleFollowRequestMutationOptions = Apollo.BaseMutationOptions<
  HandleFollowRequestMutationResponse,
  HandleFollowRequestMutationVariables
>;
