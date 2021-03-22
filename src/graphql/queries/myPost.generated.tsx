import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type MyPostQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
}>;

export type MyPostQueryResponse = { __typename?: 'Query' } & {
  myPost: { __typename?: 'PostConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Post' } & Pick<Types.Post, 'id'> & {
            mediasPath?: Types.Maybe<Array<{ __typename?: 'Media' } & Pick<Types.Media, 'filePath'>>>;
          }
      >
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const MyPostDocument = gql`
  query myPost($page: Float!, $limit: Float!) {
    myPost(page: $page, limit: $limit) {
      items {
        id
        mediasPath {
          filePath
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
export function useMyPostQuery(baseOptions: Apollo.QueryHookOptions<MyPostQueryResponse, MyPostQueryVariables>) {
  return Apollo.useQuery<MyPostQueryResponse, MyPostQueryVariables>(MyPostDocument, baseOptions);
}
export function useMyPostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyPostQueryResponse, MyPostQueryVariables>,
) {
  return Apollo.useLazyQuery<MyPostQueryResponse, MyPostQueryVariables>(MyPostDocument, baseOptions);
}
export type MyPostQueryHookResult = ReturnType<typeof useMyPostQuery>;
export type MyPostLazyQueryHookResult = ReturnType<typeof useMyPostLazyQuery>;
export type MyPostQueryResult = Apollo.QueryResult<MyPostQueryResponse, MyPostQueryVariables>;
