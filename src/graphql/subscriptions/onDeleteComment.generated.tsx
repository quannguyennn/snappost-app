import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type OnDeleteCommentSubscriptionVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type OnDeleteCommentSubscriptionResponse = { __typename?: 'Subscription' } & {
  onDeleteComment: { __typename?: 'CommentDeletePayload' } & Pick<Types.CommentDeletePayload, 'id' | 'postId'>;
};

export const OnDeleteCommentDocument = gql`
  subscription onDeleteComment($postId: Float!) {
    onDeleteComment(postId: $postId) {
      id
      postId
    }
  }
`;
export function useOnDeleteCommentSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    OnDeleteCommentSubscriptionResponse,
    OnDeleteCommentSubscriptionVariables
  >,
) {
  return Apollo.useSubscription<OnDeleteCommentSubscriptionResponse, OnDeleteCommentSubscriptionVariables>(
    OnDeleteCommentDocument,
    baseOptions,
  );
}
export type OnDeleteCommentSubscriptionHookResult = ReturnType<typeof useOnDeleteCommentSubscription>;
export type OnDeleteCommentSubscriptionResult = Apollo.SubscriptionResult<OnDeleteCommentSubscriptionResponse>;
