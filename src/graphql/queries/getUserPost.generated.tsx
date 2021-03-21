import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetUserPostQueryVariables = Types.Exact<{
  page: Types.Scalars['Float'];
  limit: Types.Scalars['Float'];
  userId: Types.Scalars['Float'];
}>;

export type GetUserPostQueryResponse = { __typename?: 'Query' } & {
  getUserPost: { __typename?: 'PostConnection' } & {
    items?: Types.Maybe<
      Array<
        { __typename?: 'Post' } & Pick<
          Types.Post,
          'id' | 'creatorId' | 'medias' | 'caption' | 'rawCaption' | 'createdAt' | 'updatedAt' | 'totalLike' | 'isLike'
        > & {
            mediasPath?: Types.Maybe<Array<{ __typename?: 'Media' } & Pick<Types.Media, 'filePath'>>>;
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
                | 'blocked'
                | 'createdAt'
                | 'updatedAt'
                | 'avatarFilePath'
                | 'followStatus'
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

export const GetUserPostDocument = gql`
  query getUserPost($page: Float!, $limit: Float!, $userId: Float!) {
    getUserPost(page: $page, limit: $limit, userId: $userId) {
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
          blocked
          createdAt
          updatedAt
          avatarFilePath
          followStatus
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
export function useGetUserPostQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserPostQueryResponse, GetUserPostQueryVariables>,
) {
  return Apollo.useQuery<GetUserPostQueryResponse, GetUserPostQueryVariables>(GetUserPostDocument, baseOptions);
}
export function useGetUserPostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserPostQueryResponse, GetUserPostQueryVariables>,
) {
  return Apollo.useLazyQuery<GetUserPostQueryResponse, GetUserPostQueryVariables>(GetUserPostDocument, baseOptions);
}
export type GetUserPostQueryHookResult = ReturnType<typeof useGetUserPostQuery>;
export type GetUserPostLazyQueryHookResult = ReturnType<typeof useGetUserPostLazyQuery>;
export type GetUserPostQueryResult = Apollo.QueryResult<GetUserPostQueryResponse, GetUserPostQueryVariables>;
