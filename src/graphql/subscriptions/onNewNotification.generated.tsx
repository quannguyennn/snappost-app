import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnNewNotificationSubscriptionVariables = Types.Exact<{
  userId: Types.Scalars['Float'];
}>;

export type OnNewNotificationSubscriptionResponse = { __typename?: 'Subscription' } & {
  onNewNotification: { __typename?: 'Notification' } & Pick<
    Types.Notification,
    'id' | 'triggerId' | 'userId' | 'content' | 'link' | 'isSeen' | 'createdAt' | 'updatedAt'
  > & { triggerInfo: { __typename?: 'User' } & Pick<Types.User, 'name' | 'avatarFilePath'> };
};

export const OnNewNotificationDocument = gql`
  subscription onNewNotification($userId: Float!) {
    onNewNotification(userId: $userId) {
      id
      triggerId
      userId
      content
      link
      isSeen
      createdAt
      updatedAt
      triggerInfo {
        name
        avatarFilePath
      }
    }
  }
`;
export function useOnNewNotificationSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    OnNewNotificationSubscriptionResponse,
    OnNewNotificationSubscriptionVariables
  >,
) {
  return Apollo.useSubscription<OnNewNotificationSubscriptionResponse, OnNewNotificationSubscriptionVariables>(
    OnNewNotificationDocument,
    baseOptions,
  );
}
export type OnNewNotificationSubscriptionHookResult = ReturnType<typeof useOnNewNotificationSubscription>;
export type OnNewNotificationSubscriptionResult = Apollo.SubscriptionResult<OnNewNotificationSubscriptionResponse>;
