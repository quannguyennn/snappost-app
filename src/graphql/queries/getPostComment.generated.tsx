import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetPostCommentQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
  postId: Types.Scalars['Float'];
}>;

export type GetPostCommentQueryResponse = { __typename?: 'Query' } & {
  getPostComment: { __typename?: 'CommentConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Comments' } & Pick<Types.Comments, 'id' | 'content' | 'createdAt' | 'creatorId'> & {
            creatorInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'>;
          }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const GetPostCommentDocument = gql`
  query getPostComment($page: Float!, $limit: Float!, $postId: Float!) {
    getPostComment(page: $page, limit: $limit, postId: $postId) {
      items {
        id
        content
        createdAt
        creatorId
        creatorInfo {
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
export function useGetPostCommentQuery(
  baseOptions: Apollo.QueryHookOptions<GetPostCommentQueryResponse, GetPostCommentQueryVariables>,
) {
  return Apollo.useQuery<GetPostCommentQueryResponse, GetPostCommentQueryVariables>(
    GetPostCommentDocument,
    baseOptions,
  );
}
export function useGetPostCommentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPostCommentQueryResponse, GetPostCommentQueryVariables>,
) {
  return Apollo.useLazyQuery<GetPostCommentQueryResponse, GetPostCommentQueryVariables>(
    GetPostCommentDocument,
    baseOptions,
  );
}
export type GetPostCommentQueryHookResult = ReturnType<typeof useGetPostCommentQuery>;
export type GetPostCommentLazyQueryHookResult = ReturnType<typeof useGetPostCommentLazyQuery>;
export type GetPostCommentQueryResult = Apollo.QueryResult<GetPostCommentQueryResponse, GetPostCommentQueryVariables>;
