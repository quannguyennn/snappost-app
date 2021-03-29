import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SetSeenMessageMutationVariables = Types.Exact<{
  chatId: Types.Scalars['Float'];
}>;

export type SetSeenMessageMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'setSeenMessage'>;

export const SetSeenMessageDocument = gql`
  mutation setSeenMessage($chatId: Float!) {
    setSeenMessage(chatId: $chatId)
  }
`;
export function useSetSeenMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<SetSeenMessageMutationResponse, SetSeenMessageMutationVariables>,
) {
  return Apollo.useMutation<SetSeenMessageMutationResponse, SetSeenMessageMutationVariables>(
    SetSeenMessageDocument,
    baseOptions,
  );
}
export type SetSeenMessageMutationHookResult = ReturnType<typeof useSetSeenMessageMutation>;
export type SetSeenMessageMutationResult = Apollo.MutationResult<SetSeenMessageMutationResponse>;
export type SetSeenMessageMutationOptions = Apollo.BaseMutationOptions<
  SetSeenMessageMutationResponse,
  SetSeenMessageMutationVariables
>;
