import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type BlockUserMutationVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type BlockUserMutationResponse = { __typename?: 'Mutation' } & {
  blockUser: { __typename?: 'User' } & Pick<
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

export const BlockUserDocument = gql`
  mutation blockUser($id: Float!) {
    blockUser(id: $id) {
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
export function useBlockUserMutation(
  baseOptions?: Apollo.MutationHookOptions<BlockUserMutationResponse, BlockUserMutationVariables>,
) {
  return Apollo.useMutation<BlockUserMutationResponse, BlockUserMutationVariables>(BlockUserDocument, baseOptions);
}
export type BlockUserMutationHookResult = ReturnType<typeof useBlockUserMutation>;
export type BlockUserMutationResult = Apollo.MutationResult<BlockUserMutationResponse>;
export type BlockUserMutationOptions = Apollo.BaseMutationOptions<
  BlockUserMutationResponse,
  BlockUserMutationVariables
>;
