import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetNewFeedQueryVariables = Types.Exact<{
  limit?: Types.Maybe<Types.Scalars['Int']>;
  page?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type GetNewFeedQueryResponse = { __typename?: 'Query' } & {
  getNewFeed: { __typename?: 'PostConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Post' } & Pick<
          Types.Post,
          'id' | 'creatorId' | 'medias' | 'caption' | 'rawCaption' | 'createdAt' | 'updatedAt' | 'totalLike' | 'isLike'
        > & {
            mediasPath?: Types.Maybe<Array<{ __typename?: 'Media' } & Pick<Types.Media, 'id' | 'filePath'>>>;
            creatorInfo?: Types.Maybe<
              { __typename?: 'User' } & Pick<
                Types.User,
                | 'id'
                | 'name'
                | 'nickname'
                | 'intro'
                | 'zaloId'
                | 'avatar'
                | 'isNew'
                | 'createdAt'
                | 'updatedAt'
                | 'avatarFilePath'
              >
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

export const GetNewFeedDocument = gql`
  query getNewFeed($limit: Int, $page: Int) {
    getNewFeed(limit: $limit, page: $page) {
      items {
        id
        creatorId
        medias
        caption
        rawCaption
        createdAt
        updatedAt
        totalLike
        isLike
        mediasPath {
          id
          filePath
        }
        creatorInfo {
          id
          name
          nickname
          intro
          zaloId
          avatar
          isNew
          createdAt
          updatedAt
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
export function useGetNewFeedQuery(
  baseOptions?: Apollo.QueryHookOptions<GetNewFeedQueryResponse, GetNewFeedQueryVariables>,
) {
  return Apollo.useQuery<GetNewFeedQueryResponse, GetNewFeedQueryVariables>(GetNewFeedDocument, baseOptions);
}
export function useGetNewFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNewFeedQueryResponse, GetNewFeedQueryVariables>,
) {
  return Apollo.useLazyQuery<GetNewFeedQueryResponse, GetNewFeedQueryVariables>(GetNewFeedDocument, baseOptions);
}
export type GetNewFeedQueryHookResult = ReturnType<typeof useGetNewFeedQuery>;
export type GetNewFeedLazyQueryHookResult = ReturnType<typeof useGetNewFeedLazyQuery>;
export type GetNewFeedQueryResult = Apollo.QueryResult<GetNewFeedQueryResponse, GetNewFeedQueryVariables>;
