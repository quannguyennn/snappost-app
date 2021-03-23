import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetNotificationQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
}>;

export type GetNotificationQueryResponse = { __typename?: 'Query' } & {
  getNotification: { __typename?: 'NotificationConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Notification' } & Pick<
          Types.Notification,
          'id' | 'triggerId' | 'userId' | 'content' | 'link' | 'isSeen' | 'createdAt'
        > & { triggerInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'> }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const GetNotificationDocument = gql`
  query getNotification($page: Float!, $limit: Float!) {
    getNotification(page: $page, limit: $limit) {
      items {
        id
        triggerId
        userId
        content
        link
        isSeen
        createdAt
        triggerInfo {
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
export function useGetNotificationQuery(
  baseOptions: Apollo.QueryHookOptions<GetNotificationQueryResponse, GetNotificationQueryVariables>,
) {
  return Apollo.useQuery<GetNotificationQueryResponse, GetNotificationQueryVariables>(
    GetNotificationDocument,
    baseOptions,
  );
}
export function useGetNotificationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationQueryResponse, GetNotificationQueryVariables>,
) {
  return Apollo.useLazyQuery<GetNotificationQueryResponse, GetNotificationQueryVariables>(
    GetNotificationDocument,
    baseOptions,
  );
}
export type GetNotificationQueryHookResult = ReturnType<typeof useGetNotificationQuery>;
export type GetNotificationLazyQueryHookResult = ReturnType<typeof useGetNotificationLazyQuery>;
export type GetNotificationQueryResult = Apollo.QueryResult<
  GetNotificationQueryResponse,
  GetNotificationQueryVariables
>;
