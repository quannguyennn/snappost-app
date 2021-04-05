import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnReceiveMessageSubscriptionVariables = Types.Exact<{
  userId: Types.Scalars['Float'];
}>;

export type OnReceiveMessageSubscriptionResponse = { __typename?: 'Subscription' } & {
  onReceiveMessage: { __typename?: 'ReceivedMessage' } & Pick<Types.ReceivedMessage, 'chatId' | 'userId'> & {
      message: { __typename?: 'Message' } & Pick<
        Types.Message,
        'id' | 'sender' | 'chatId' | 'content' | 'media' | 'mediaType'
      > & { senderInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'avatarFilePath'> };
    };
};

export const OnReceiveMessageDocument = gql`
  subscription onReceiveMessage($userId: Float!) {
    onReceiveMessage(userId: $userId) {
      chatId
      userId
      message {
        id
        sender
        chatId
        content
        media
        mediaType
        senderInfo {
          id
          name
          avatarFilePath
        }
      }
    }
  }
`;
export function useOnReceiveMessageSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    OnReceiveMessageSubscriptionResponse,
    OnReceiveMessageSubscriptionVariables
  >,
) {
  return Apollo.useSubscription<OnReceiveMessageSubscriptionResponse, OnReceiveMessageSubscriptionVariables>(
    OnReceiveMessageDocument,
    baseOptions,
  );
}
export type OnReceiveMessageSubscriptionHookResult = ReturnType<typeof useOnReceiveMessageSubscription>;
export type OnReceiveMessageSubscriptionResult = Apollo.SubscriptionResult<OnReceiveMessageSubscriptionResponse>;
