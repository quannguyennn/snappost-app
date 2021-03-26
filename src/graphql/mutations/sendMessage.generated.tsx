import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SendMessageMutationVariables = Types.Exact<{
  input: Types.NewMessageInput;
}>;

export type SendMessageMutationResponse = { __typename?: 'Mutation' } & {
  sendMessage: { __typename?: 'Message' } & Pick<
    Types.Message,
    'id' | 'sender' | 'chatId' | 'content' | 'media' | 'mediaType' | 'isRead' | 'createdAt'
  > & { senderInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'> };
};

export const SendMessageDocument = gql`
  mutation sendMessage($input: NewMessageInput!) {
    sendMessage(input: $input) {
      id
      sender
      chatId
      content
      media
      mediaType
      isRead
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
export function useSendMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<SendMessageMutationResponse, SendMessageMutationVariables>,
) {
  return Apollo.useMutation<SendMessageMutationResponse, SendMessageMutationVariables>(
    SendMessageDocument,
    baseOptions,
  );
}
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutationResponse>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<
  SendMessageMutationResponse,
  SendMessageMutationVariables
>;
