import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetFollowRequestQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
}>;

export type GetFollowRequestQueryResponse = { __typename?: 'Query' } & {
  getFollowRequest: { __typename?: 'FollowConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Follow' } & Pick<
          Types.Follow,
          'id' | 'creatorId' | 'followUser' | 'status' | 'createdAt' | 'updatedAt'
        > & { requestInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'> }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const GetFollowRequestDocument = gql`
  query getFollowRequest($page: Float!, $limit: Float!) {
    getFollowRequest(page: $page, limit: $limit) {
      items {
        id
        creatorId
        followUser
        status
        createdAt
        updatedAt
        requestInfo {
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
export function useGetFollowRequestQuery(
  baseOptions: Apollo.QueryHookOptions<GetFollowRequestQueryResponse, GetFollowRequestQueryVariables>,
) {
  return Apollo.useQuery<GetFollowRequestQueryResponse, GetFollowRequestQueryVariables>(
    GetFollowRequestDocument,
    baseOptions,
  );
}
export function useGetFollowRequestLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFollowRequestQueryResponse, GetFollowRequestQueryVariables>,
) {
  return Apollo.useLazyQuery<GetFollowRequestQueryResponse, GetFollowRequestQueryVariables>(
    GetFollowRequestDocument,
    baseOptions,
  );
}
export type GetFollowRequestQueryHookResult = ReturnType<typeof useGetFollowRequestQuery>;
export type GetFollowRequestLazyQueryHookResult = ReturnType<typeof useGetFollowRequestLazyQuery>;
export type GetFollowRequestQueryResult = Apollo.QueryResult<
  GetFollowRequestQueryResponse,
  GetFollowRequestQueryVariables
>;
