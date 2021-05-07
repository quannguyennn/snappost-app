import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type LeaveStreamMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type LeaveStreamMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'leaveStream'>;

export const LeaveStreamDocument = gql`
  mutation leaveStream($id: Float!) {
    leaveStream(id: $id)
  }
`;
export function useLeaveStreamMutation(
  baseOptions?: Apollo.MutationHookOptions<LeaveStreamMutationResponse, LeaveStreamMutationVariables>,
) {
  return Apollo.useMutation<LeaveStreamMutationResponse, LeaveStreamMutationVariables>(
    LeaveStreamDocument,
    baseOptions,
  );
}
export type LeaveStreamMutationHookResult = ReturnType<typeof useLeaveStreamMutation>;
export type LeaveStreamMutationResult = Apollo.MutationResult<LeaveStreamMutationResponse>;
export type LeaveStreamMutationOptions = Apollo.BaseMutationOptions<
  LeaveStreamMutationResponse,
  LeaveStreamMutationVariables
>;
