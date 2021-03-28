import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetChatHasUnseenMessageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetChatHasUnseenMessageQueryResponse = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getChatHasUnseenMessage'
>;

export const GetChatHasUnseenMessageDocument = gql`
  query getChatHasUnseenMessage {
    getChatHasUnseenMessage
  }
`;
export function useGetChatHasUnseenMessageQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChatHasUnseenMessageQueryResponse, GetChatHasUnseenMessageQueryVariables>,
) {
  return Apollo.useQuery<GetChatHasUnseenMessageQueryResponse, GetChatHasUnseenMessageQueryVariables>(
    GetChatHasUnseenMessageDocument,
    baseOptions,
  );
}
export function useGetChatHasUnseenMessageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChatHasUnseenMessageQueryResponse,
    GetChatHasUnseenMessageQueryVariables
  >,
) {
  return Apollo.useLazyQuery<GetChatHasUnseenMessageQueryResponse, GetChatHasUnseenMessageQueryVariables>(
    GetChatHasUnseenMessageDocument,
    baseOptions,
  );
}
export type GetChatHasUnseenMessageQueryHookResult = ReturnType<typeof useGetChatHasUnseenMessageQuery>;
export type GetChatHasUnseenMessageLazyQueryHookResult = ReturnType<typeof useGetChatHasUnseenMessageLazyQuery>;
export type GetChatHasUnseenMessageQueryResult = Apollo.QueryResult<
  GetChatHasUnseenMessageQueryResponse,
  GetChatHasUnseenMessageQueryVariables
>;
