import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetMessageQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
  chatId: Types.Scalars['Float'];
}>;

export type GetMessageQueryResponse = { __typename?: 'Query' } & {
  getMessage: { __typename?: 'MessageConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Message' } & Pick<
          Types.Message,
          'id' | 'sender' | 'chatId' | 'content' | 'media' | 'mediaType' | 'sent' | 'tempId' | 'received' | 'createdAt'
        > & { senderInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'> }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const GetMessageDocument = gql`
  query getMessage($page: Float!, $limit: Float!, $chatId: Float!) {
    getMessage(page: $page, limit: $limit, chatId: $chatId) {
      items {
        id
        sender
        chatId
        content
        media
        mediaType
        sent
        tempId
        received
        createdAt
        senderInfo {
          id
          name
          nickname
          avatarFilePath
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
export function useGetMessageQuery(
  baseOptions: Apollo.QueryHookOptions<GetMessageQueryResponse, GetMessageQueryVariables>,
) {
  return Apollo.useQuery<GetMessageQueryResponse, GetMessageQueryVariables>(GetMessageDocument, baseOptions);
}
export function useGetMessageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMessageQueryResponse, GetMessageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetMessageQueryResponse, GetMessageQueryVariables>(GetMessageDocument, baseOptions);
}
export type GetMessageQueryHookResult = ReturnType<typeof useGetMessageQuery>;
export type GetMessageLazyQueryHookResult = ReturnType<typeof useGetMessageLazyQuery>;
export type GetMessageQueryResult = Apollo.QueryResult<GetMessageQueryResponse, GetMessageQueryVariables>;
