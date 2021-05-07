import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnLeaveStreamSubscriptionVariables = Types.Exact<{
  streamId: Types.Scalars['Float'];
}>;

export type OnLeaveStreamSubscriptionResponse = { __typename?: 'Subscription' } & {
  onLeaveStream: { __typename?: 'StreamUser' } & Pick<Types.StreamUser, 'id' | 'userId' | 'name' | 'avatar'>;
};

export const OnLeaveStreamDocument = gql`
  subscription onLeaveStream($streamId: Float!) {
    onLeaveStream(streamId: $streamId) {
      id
      userId
      name
      avatar
    }
  }
`;
export function useOnLeaveStreamSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<OnLeaveStreamSubscriptionResponse, OnLeaveStreamSubscriptionVariables>,
) {
  return Apollo.useSubscription<OnLeaveStreamSubscriptionResponse, OnLeaveStreamSubscriptionVariables>(
    OnLeaveStreamDocument,
    baseOptions,
  );
}
export type OnLeaveStreamSubscriptionHookResult = ReturnType<typeof useOnLeaveStreamSubscription>;
export type OnLeaveStreamSubscriptionResult = Apollo.SubscriptionResult<OnLeaveStreamSubscriptionResponse>;
