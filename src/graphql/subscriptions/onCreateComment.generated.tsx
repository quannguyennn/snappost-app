import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnCreateCommentSubscriptionVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type OnCreateCommentSubscriptionResponse = { __typename?: 'Subscription' } & {
  onCreateComment: { __typename?: 'Comments' } & Pick<Types.Comments, 'id' | 'content' | 'createdAt'> & {
      creatorInfo: { __typename?: 'User' } & Pick<
        Types.User,
        'id' | 'name' | 'nickname' | 'createdAt' | 'avatarFilePath'
      >;
    };
};

export const OnCreateCommentDocument = gql`
  subscription onCreateComment($postId: Float!) {
    onCreateComment(postId: $postId) {
      id
      content
      createdAt
      creatorInfo {
        id
        name
        nickname
        createdAt
        avatarFilePath
      }
    }
  }
`;
export function useOnCreateCommentSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    OnCreateCommentSubscriptionResponse,
    OnCreateCommentSubscriptionVariables
  >,
) {
  return Apollo.useSubscription<OnCreateCommentSubscriptionResponse, OnCreateCommentSubscriptionVariables>(
    OnCreateCommentDocument,
    baseOptions,
  );
}
export type OnCreateCommentSubscriptionHookResult = ReturnType<typeof useOnCreateCommentSubscription>;
export type OnCreateCommentSubscriptionResult = Apollo.SubscriptionResult<OnCreateCommentSubscriptionResponse>;
