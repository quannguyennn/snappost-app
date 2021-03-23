import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SetSeenNotificationMutationVariables = Types.Exact<{ [key: string]: never }>;

export type SetSeenNotificationMutationResponse = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'setSeenNotification'
>;

export const SetSeenNotificationDocument = gql`
  mutation setSeenNotification {
    setSeenNotification
  }
`;
export function useSetSeenNotificationMutation(
  baseOptions?: Apollo.MutationHookOptions<SetSeenNotificationMutationResponse, SetSeenNotificationMutationVariables>,
) {
  return Apollo.useMutation<SetSeenNotificationMutationResponse, SetSeenNotificationMutationVariables>(
    SetSeenNotificationDocument,
    baseOptions,
  );
}
export type SetSeenNotificationMutationHookResult = ReturnType<typeof useSetSeenNotificationMutation>;
export type SetSeenNotificationMutationResult = Apollo.MutationResult<SetSeenNotificationMutationResponse>;
export type SetSeenNotificationMutationOptions = Apollo.BaseMutationOptions<
  SetSeenNotificationMutationResponse,
  SetSeenNotificationMutationVariables
>;
