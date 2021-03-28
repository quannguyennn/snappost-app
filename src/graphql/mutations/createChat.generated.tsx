import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CreateChatMutationVariables = Types.Exact<{
  participants: Array<Types.Scalars['Float']> | Types.Scalars['Float'];
}>;

export type CreateChatMutationResponse = { __typename?: 'Mutation' } & {
  createChat: { __typename?: 'Chat' } & Pick<
    Types.Chat,
    'id' | 'participants' | 'isTemp' | 'lastMessage' | 'createdAt'
  > & {
      participantInfo: Array<
        { __typename?: 'User' } & Pick<
          Types.User,
          'id' | 'name' | 'nickname' | 'lastSeen' | 'avatarFilePath' | 'isBlockMe'
        >
      >;
    };
};

export const CreateChatDocument = gql`
  mutation createChat($participants: [Float!]!) {
    createChat(participants: $participants) {
      id
      participants
      isTemp
      lastMessage
      createdAt
      participantInfo {
        id
        name
        nickname
        lastSeen
        avatarFilePath
        isBlockMe
      }
    }
  }
`;
export function useCreateChatMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateChatMutationResponse, CreateChatMutationVariables>,
) {
  return Apollo.useMutation<CreateChatMutationResponse, CreateChatMutationVariables>(CreateChatDocument, baseOptions);
}
export type CreateChatMutationHookResult = ReturnType<typeof useCreateChatMutation>;
export type CreateChatMutationResult = Apollo.MutationResult<CreateChatMutationResponse>;
export type CreateChatMutationOptions = Apollo.BaseMutationOptions<
  CreateChatMutationResponse,
  CreateChatMutationVariables
>;
