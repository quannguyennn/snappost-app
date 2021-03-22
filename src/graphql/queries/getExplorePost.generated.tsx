import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetExplorePostQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
}>;

export type GetExplorePostQueryResponse = { __typename?: 'Query' } & {
  getExplorePost: { __typename?: 'PostConnection' } & {
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

export const GetExplorePostDocument = gql`
  query getExplorePost($page: Float!, $limit: Float!) {
    getExplorePost(page: $page, limit: $limit) {
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
export function useGetExplorePostQuery(
  baseOptions: Apollo.QueryHookOptions<GetExplorePostQueryResponse, GetExplorePostQueryVariables>,
) {
  return Apollo.useQuery<GetExplorePostQueryResponse, GetExplorePostQueryVariables>(
    GetExplorePostDocument,
    baseOptions,
  );
}
export function useGetExplorePostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExplorePostQueryResponse, GetExplorePostQueryVariables>,
) {
  return Apollo.useLazyQuery<GetExplorePostQueryResponse, GetExplorePostQueryVariables>(
    GetExplorePostDocument,
    baseOptions,
  );
}
export type GetExplorePostQueryHookResult = ReturnType<typeof useGetExplorePostQuery>;
export type GetExplorePostLazyQueryHookResult = ReturnType<typeof useGetExplorePostLazyQuery>;
export type GetExplorePostQueryResult = Apollo.QueryResult<GetExplorePostQueryResponse, GetExplorePostQueryVariables>;
