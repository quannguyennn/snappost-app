import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SendStreamChatMutationVariables = Types.Exact<{
  isSystem: Types.Scalars['Boolean'];
  chat: Types.Scalars['String'];
  streamId: Types.Scalars['Float'];
}>;

export type SendStreamChatMutationResponse = { __typename?: 'Mutation' } & {
  sendStreamChat: { __typename?: 'StreamChat' } & Pick<
    Types.StreamChat,
    'id' | 'userId' | 'name' | 'avatar' | 'chat' | 'isSystem'
  >;
};

export const SendStreamChatDocument = gql`
  mutation sendStreamChat($isSystem: Boolean!, $chat: String!, $streamId: Float!) {
    sendStreamChat(isSystem: $isSystem, chat: $chat, streamId: $streamId) {
      id
      userId
      name
      avatar
      chat
      isSystem
    }
  }
`;
export function useSendStreamChatMutation(
  baseOptions?: Apollo.MutationHookOptions<SendStreamChatMutationResponse, SendStreamChatMutationVariables>,
) {
  return Apollo.useMutation<SendStreamChatMutationResponse, SendStreamChatMutationVariables>(
    SendStreamChatDocument,
    baseOptions,
  );
}
export type SendStreamChatMutationHookResult = ReturnType<typeof useSendStreamChatMutation>;
export type SendStreamChatMutationResult = Apollo.MutationResult<SendStreamChatMutationResponse>;
export type SendStreamChatMutationOptions = Apollo.BaseMutationOptions<
  SendStreamChatMutationResponse,
  SendStreamChatMutationVariables
>;
