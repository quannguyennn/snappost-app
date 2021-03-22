import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnUnLikePostSubscriptionVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type OnUnLikePostSubscriptionResponse = { __typename?: 'Subscription' } & {
  onUnLikePost: { __typename?: 'Like' } & Pick<Types.Like, 'id' | 'postId' | 'userId' | 'createdAt'> & {
      creatorInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'>;
    };
};

export const OnUnLikePostDocument = gql`
  subscription onUnLikePost($postId: Float!) {
    onUnLikePost(postId: $postId) {
      id
      postId
      userId
      createdAt
      creatorInfo {
        id
        name
        nickname
        avatarFilePath
      }
    }
  }
`;
export function useOnUnLikePostSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<OnUnLikePostSubscriptionResponse, OnUnLikePostSubscriptionVariables>,
) {
  return Apollo.useSubscription<OnUnLikePostSubscriptionResponse, OnUnLikePostSubscriptionVariables>(
    OnUnLikePostDocument,
    baseOptions,
  );
}
export type OnUnLikePostSubscriptionHookResult = ReturnType<typeof useOnUnLikePostSubscription>;
export type OnUnLikePostSubscriptionResult = Apollo.SubscriptionResult<OnUnLikePostSubscriptionResponse>;
