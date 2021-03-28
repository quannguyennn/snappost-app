import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnNewMessageSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['Float'];
}>;

export type OnNewMessageSubscriptionResponse = { __typename?: 'Subscription' } & {
  onNewMessage: { __typename?: 'Message' } & Pick<
    Types.Message,
    'id' | 'sender' | 'chatId' | 'content' | 'media' | 'mediaType' | 'sent' | 'tempId' | 'received' | 'createdAt'
  > & { senderInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'> };
};

export const OnNewMessageDocument = gql`
  subscription onNewMessage($chatId: Float!) {
    onNewMessage(chatId: $chatId) {
      id
      sender
      chatId
      content
      media
      mediaType
      sent
      tempId
      received
      createdAt
      senderInfo {
        id
        name
        nickname
        avatarFilePath
      }
    }
  }
`;
export function useOnNewMessageSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<OnNewMessageSubscriptionResponse, OnNewMessageSubscriptionVariables>,
) {
  return Apollo.useSubscription<OnNewMessageSubscriptionResponse, OnNewMessageSubscriptionVariables>(
    OnNewMessageDocument,
    baseOptions,
  );
}
export type OnNewMessageSubscriptionHookResult = ReturnType<typeof useOnNewMessageSubscription>;
export type OnNewMessageSubscriptionResult = Apollo.SubscriptionResult<OnNewMessageSubscriptionResponse>;
