import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type SearchUserQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
  isRestricted?: Types.Maybe<Types.Scalars['Boolean']>;
  keyword: Types.Scalars['String'];
}>;

export type SearchUserQueryResponse = { __typename?: 'Query' } & {
  searchUser: { __typename?: 'UserConnection' } & {
    items?: Types.Maybe<
      Array<{ __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath'>>
    >;
    meta: { __typename?: 'BasePaginationMeta' } & Pick<
      Types.BasePaginationMeta,
      'itemCount' | 'totalItems' | 'itemsPerPage' | 'totalPages' | 'currentPage'
    >;
  };
};

export const SearchUserDocument = gql`
  query searchUser($page: Float!, $limit: Float!, $isRestricted: Boolean, $keyword: String!) {
    searchUser(page: $page, limit: $limit, isRestricted: $isRestricted, keyword: $keyword) {
      items {
        id
        name
        nickname
        avatarFilePath
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
export function useSearchUserQuery(
  baseOptions: Apollo.QueryHookOptions<SearchUserQueryResponse, SearchUserQueryVariables>,
) {
  return Apollo.useQuery<SearchUserQueryResponse, SearchUserQueryVariables>(SearchUserDocument, baseOptions);
}
export function useSearchUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchUserQueryResponse, SearchUserQueryVariables>,
) {
  return Apollo.useLazyQuery<SearchUserQueryResponse, SearchUserQueryVariables>(SearchUserDocument, baseOptions);
}
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>;
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>;
export type SearchUserQueryResult = Apollo.QueryResult<SearchUserQueryResponse, SearchUserQueryVariables>;
