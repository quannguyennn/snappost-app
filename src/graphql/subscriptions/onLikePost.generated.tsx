import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnLikePostSubscriptionVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type OnLikePostSubscriptionResponse = { __typename?: 'Subscription' } & {
  onLikePost: { __typename?: 'Like' } & Pick<Types.Like, 'id' | 'postId' | 'userId' | 'createdAt'> & {
      creatorInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'>;
    };
};

export const OnLikePostDocument = gql`
  subscription onLikePost($postId: Float!) {
    onLikePost(postId: $postId) {
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
export function useOnLikePostSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<OnLikePostSubscriptionResponse, OnLikePostSubscriptionVariables>,
) {
  return Apollo.useSubscription<OnLikePostSubscriptionResponse, OnLikePostSubscriptionVariables>(
    OnLikePostDocument,
    baseOptions,
  );
}
export type OnLikePostSubscriptionHookResult = ReturnType<typeof useOnLikePostSubscription>;
export type OnLikePostSubscriptionResult = Apollo.SubscriptionResult<OnLikePostSubscriptionResponse>;
