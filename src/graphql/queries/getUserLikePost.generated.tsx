import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetUserLikePostQueryVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type GetUserLikePostQueryResponse = { __typename?: 'Query' } & {
  getUserLikePost: Array<
    { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'nickname' | 'avatarFilePath' | 'isBlockMe'>
  >;
};

export const GetUserLikePostDocument = gql`
  query getUserLikePost($postId: Float!) {
    getUserLikePost(postId: $postId) {
      id
      name
      nickname
      avatarFilePath
      isBlockMe
    }
  }
`;
export function useGetUserLikePostQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserLikePostQueryResponse, GetUserLikePostQueryVariables>,
) {
  return Apollo.useQuery<GetUserLikePostQueryResponse, GetUserLikePostQueryVariables>(
    GetUserLikePostDocument,
    baseOptions,
  );
}
export function useGetUserLikePostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserLikePostQueryResponse, GetUserLikePostQueryVariables>,
) {
  return Apollo.useLazyQuery<GetUserLikePostQueryResponse, GetUserLikePostQueryVariables>(
    GetUserLikePostDocument,
    baseOptions,
  );
}
export type GetUserLikePostQueryHookResult = ReturnType<typeof useGetUserLikePostQuery>;
export type GetUserLikePostLazyQueryHookResult = ReturnType<typeof useGetUserLikePostLazyQuery>;
export type GetUserLikePostQueryResult = Apollo.QueryResult<
  GetUserLikePostQueryResponse,
  GetUserLikePostQueryVariables
>;
