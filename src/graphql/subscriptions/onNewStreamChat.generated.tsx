import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnNewStreamChatSubscriptionVariables = Types.Exact<{
  streamId: Types.Scalars['Float'];
}>;

export type OnNewStreamChatSubscriptionResponse = { __typename?: 'Subscription' } & {
  onNewStreamChat: { __typename?: 'StreamChat' } & Pick<
    Types.StreamChat,
    'id' | 'userId' | 'name' | 'avatar' | 'chat' | 'isSystem'
  >;
};

export const OnNewStreamChatDocument = gql`
  subscription onNewStreamChat($streamId: Float!) {
    onNewStreamChat(streamId: $streamId) {
      id
      userId
      name
      avatar
      chat
      isSystem
    }
  }
`;
export function useOnNewStreamChatSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    OnNewStreamChatSubscriptionResponse,
    OnNewStreamChatSubscriptionVariables
  >,
) {
  return Apollo.useSubscription<OnNewStreamChatSubscriptionResponse, OnNewStreamChatSubscriptionVariables>(
    OnNewStreamChatDocument,
    baseOptions,
  );
}
export type OnNewStreamChatSubscriptionHookResult = ReturnType<typeof useOnNewStreamChatSubscription>;
export type OnNewStreamChatSubscriptionResult = Apollo.SubscriptionResult<OnNewStreamChatSubscriptionResponse>;
