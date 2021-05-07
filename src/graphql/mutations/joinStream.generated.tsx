import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type JoinStreamMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type JoinStreamMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'joinStream'>;

export const JoinStreamDocument = gql`
  mutation joinStream($id: Float!) {
    joinStream(id: $id)
  }
`;
export function useJoinStreamMutation(
  baseOptions?: Apollo.MutationHookOptions<JoinStreamMutationResponse, JoinStreamMutationVariables>,
) {
  return Apollo.useMutation<JoinStreamMutationResponse, JoinStreamMutationVariables>(JoinStreamDocument, baseOptions);
}
export type JoinStreamMutationHookResult = ReturnType<typeof useJoinStreamMutation>;
export type JoinStreamMutationResult = Apollo.MutationResult<JoinStreamMutationResponse>;
export type JoinStreamMutationOptions = Apollo.BaseMutationOptions<
  JoinStreamMutationResponse,
  JoinStreamMutationVariables
>;
