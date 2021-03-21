import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetBlockedUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBlockedUserQueryResponse = { __typename?: 'Query' } & {
  getBlockedUser?: Types.Maybe<
    Array<
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
      >
    >
  >;
};

export const GetBlockedUserDocument = gql`
  query getBlockedUser {
    getBlockedUser {
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
    }
  }
`;
export function useGetBlockedUserQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBlockedUserQueryResponse, GetBlockedUserQueryVariables>,
) {
  return Apollo.useQuery<GetBlockedUserQueryResponse, GetBlockedUserQueryVariables>(
    GetBlockedUserDocument,
    baseOptions,
  );
}
export function useGetBlockedUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBlockedUserQueryResponse, GetBlockedUserQueryVariables>,
) {
  return Apollo.useLazyQuery<GetBlockedUserQueryResponse, GetBlockedUserQueryVariables>(
    GetBlockedUserDocument,
    baseOptions,
  );
}
export type GetBlockedUserQueryHookResult = ReturnType<typeof useGetBlockedUserQuery>;
export type GetBlockedUserLazyQueryHookResult = ReturnType<typeof useGetBlockedUserLazyQuery>;
export type GetBlockedUserQueryResult = Apollo.QueryResult<GetBlockedUserQueryResponse, GetBlockedUserQueryVariables>;
