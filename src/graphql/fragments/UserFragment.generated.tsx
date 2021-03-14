import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
export type UserFragmentFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'avatarFilePath' | 'nickname' | 'name' | 'intro' | 'zaloId' | 'isNew'
>;

export const UserFragmentFragmentDoc = gql`
  fragment UserFragment on User {
    id
    avatarFilePath
    nickname
    name
    intro
    zaloId
    isNew
  }
`;
