import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnJoinStreamSubscriptionVariables = Types.Exact<{
  streamId: Types.Scalars['Float'];
}>;

export type OnJoinStreamSubscriptionResponse = { __typename?: 'Subscription' } & {
  onJoinStream: { __typename?: 'StreamUser' } & Pick<Types.StreamUser, 'id' | 'userId' | 'name' | 'avatar'>;
};

export const OnJoinStreamDocument = gql`
  subscription onJoinStream($streamId: Float!) {
    onJoinStream(streamId: $streamId) {
      id
      userId
      name
      avatar
    }
  }
`;
export function useOnJoinStreamSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<OnJoinStreamSubscriptionResponse, OnJoinStreamSubscriptionVariables>,
) {
  return Apollo.useSubscription<OnJoinStreamSubscriptionResponse, OnJoinStreamSubscriptionVariables>(
    OnJoinStreamDocument,
    baseOptions,
  );
}
export type OnJoinStreamSubscriptionHookResult = ReturnType<typeof useOnJoinStreamSubscription>;
export type OnJoinStreamSubscriptionResult = Apollo.SubscriptionResult<OnJoinStreamSubscriptionResponse>;
