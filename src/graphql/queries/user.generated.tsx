import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UserQueryVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type UserQueryResponse = { __typename?: 'Query' } & {
  user?: Types.Maybe<
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
      | 'followStatus'
    >
  >;
};

export const UserDocument = gql`
  query user($id: Float!) {
    user(id: $id) {
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
      followStatus
    }
  }
`;
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQueryResponse, UserQueryVariables>) {
  return Apollo.useQuery<UserQueryResponse, UserQueryVariables>(UserDocument, baseOptions);
}
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQueryResponse, UserQueryVariables>) {
  return Apollo.useLazyQuery<UserQueryResponse, UserQueryVariables>(UserDocument, baseOptions);
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQueryResponse, UserQueryVariables>;
