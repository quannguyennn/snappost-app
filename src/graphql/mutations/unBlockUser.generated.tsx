import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UnBlockUserMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type UnBlockUserMutationResponse = { __typename?: 'Mutation' } & {
  unBlockUser: { __typename?: 'User' } & Pick<
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
  >;
};

export const UnBlockUserDocument = gql`
  mutation unBlockUser($id: Float!) {
    unBlockUser(id: $id) {
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
export function useUnBlockUserMutation(
  baseOptions?: Apollo.MutationHookOptions<UnBlockUserMutationResponse, UnBlockUserMutationVariables>,
) {
  return Apollo.useMutation<UnBlockUserMutationResponse, UnBlockUserMutationVariables>(
    UnBlockUserDocument,
    baseOptions,
  );
}
export type UnBlockUserMutationHookResult = ReturnType<typeof useUnBlockUserMutation>;
export type UnBlockUserMutationResult = Apollo.MutationResult<UnBlockUserMutationResponse>;
export type UnBlockUserMutationOptions = Apollo.BaseMutationOptions<
  UnBlockUserMutationResponse,
  UnBlockUserMutationVariables
>;
