import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnSeenMessageSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['Float'];
}>;

export type OnSeenMessageSubscriptionResponse = { __typename?: 'Subscription' } & {
  onSeenMessage: { __typename?: 'SeenMessage' } & Pick<Types.SeenMessage, 'chatId' | 'userId'>;
};

export const OnSeenMessageDocument = gql`
  subscription onSeenMessage($chatId: Float!) {
    onSeenMessage(chatId: $chatId) {
      chatId
      userId
    }
  }
`;
export function useOnSeenMessageSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<OnSeenMessageSubscriptionResponse, OnSeenMessageSubscriptionVariables>,
) {
  return Apollo.useSubscription<OnSeenMessageSubscriptionResponse, OnSeenMessageSubscriptionVariables>(
    OnSeenMessageDocument,
    baseOptions,
  );
}
export type OnSeenMessageSubscriptionHookResult = ReturnType<typeof useOnSeenMessageSubscription>;
export type OnSeenMessageSubscriptionResult = Apollo.SubscriptionResult<OnSeenMessageSubscriptionResponse>;
