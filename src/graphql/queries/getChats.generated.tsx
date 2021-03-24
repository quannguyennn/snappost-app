import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetChatsQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
}>;

export type GetChatsQueryResponse = { __typename?: 'Query' } & {
  getChats: { __typename?: 'ChatConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Chat' } & Pick<Types.Chat, 'id' | 'participants' | 'isTemp' | 'lastMessage' | 'createdAt'> & {
            participantInfo: Array<
              { __typename?: 'User' } & Pick<
                Types.User,
                'id' | 'name' | 'nickname' | 'lastSeen' | 'avatarFilePath' | 'isBlockMe'
              >
            >;
            lastMessageData?: Types.Maybe<
              { __typename?: 'Message' } & Pick<
                Types.Message,
                'id' | 'content' | 'media' | 'mediaType' | 'isRead' | 'createdAt'
              > & { senderInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname'> }
            >;
          }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const GetChatsDocument = gql`
  query getChats($page: Float!, $limit: Float!) {
    getChats(page: $page, limit: $limit) {
      items {
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
        lastMessageData {
          id
          content
          media
          mediaType
          isRead
          createdAt
          senderInfo {
            id
            name
            nickname
          }
        }
      }
      meta {
        itemCount
        totalItems
        itemsPerPage
        totalPages
        currentPage
      }
    }
  }
`;
export function useGetChatsQuery(baseOptions: Apollo.QueryHookOptions<GetChatsQueryResponse, GetChatsQueryVariables>) {
  return Apollo.useQuery<GetChatsQueryResponse, GetChatsQueryVariables>(GetChatsDocument, baseOptions);
}
export function useGetChatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChatsQueryResponse, GetChatsQueryVariables>,
) {
  return Apollo.useLazyQuery<GetChatsQueryResponse, GetChatsQueryVariables>(GetChatsDocument, baseOptions);
}
export type GetChatsQueryHookResult = ReturnType<typeof useGetChatsQuery>;
export type GetChatsLazyQueryHookResult = ReturnType<typeof useGetChatsLazyQuery>;
export type GetChatsQueryResult = Apollo.QueryResult<GetChatsQueryResponse, GetChatsQueryVariables>;
