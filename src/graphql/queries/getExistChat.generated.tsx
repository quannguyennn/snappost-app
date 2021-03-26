import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetExistChatQueryVariables = Types.Exact<{
  participants: Array<Types.Scalars['Float']> | Types.Scalars['Float'];
}>;

export type GetExistChatQueryResponse = { __typename?: 'Query' } & {
  getExistChat?: Types.Maybe<
    { __typename?: 'Chat' } & Pick<
      Types.Chat,
      'id' | 'participants' | 'isTemp' | 'lastMessage' | 'createdAt' | 'updatedAt'
    > & {
        participantInfo: Array<
          { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'>
        >;
      }
  >;
};

export const GetExistChatDocument = gql`
  query getExistChat($participants: [Float!]!) {
    getExistChat(participants: $participants) {
      id
      participants
      isTemp
      lastMessage
      createdAt
      updatedAt
      participantInfo {
        id
        name
        nickname
        avatarFilePath
      }
    }
  }
`;
export function useGetExistChatQuery(
  baseOptions: Apollo.QueryHookOptions<GetExistChatQueryResponse, GetExistChatQueryVariables>,
) {
  return Apollo.useQuery<GetExistChatQueryResponse, GetExistChatQueryVariables>(GetExistChatDocument, baseOptions);
}
export function useGetExistChatLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExistChatQueryResponse, GetExistChatQueryVariables>,
) {
  return Apollo.useLazyQuery<GetExistChatQueryResponse, GetExistChatQueryVariables>(GetExistChatDocument, baseOptions);
}
export type GetExistChatQueryHookResult = ReturnType<typeof useGetExistChatQuery>;
export type GetExistChatLazyQueryHookResult = ReturnType<typeof useGetExistChatLazyQuery>;
export type GetExistChatQueryResult = Apollo.QueryResult<GetExistChatQueryResponse, GetExistChatQueryVariables>;
