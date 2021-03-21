import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
export type UserFragmentFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'name' | 'nickname' | 'intro' | 'zaloId' | 'avatar' | 'isNew' | 'avatarFilePath'
> & {
    nFollowing?: Types.Maybe<
      Array<
        { __typename?: 'User' } & Pick<
          Types.User,
          'id' | 'name' | 'nickname' | 'intro' | 'zaloId' | 'avatar' | 'isNew' | 'avatarFilePath'
        >
      >
    >;
    nFollower?: Types.Maybe<
      Array<
        { __typename?: 'User' } & Pick<
          Types.User,
          'id' | 'name' | 'nickname' | 'intro' | 'zaloId' | 'avatar' | 'isNew' | 'avatarFilePath'
        >
      >
    >;
  };

export const UserFragmentFragmentDoc = gql`
  fragment UserFragment on User {
    id
    name
    nickname
    intro
    zaloId
    avatar
    isNew
    avatarFilePath
    nFollowing {
      id
      name
      nickname
      intro
      zaloId
      avatar
      isNew
      avatarFilePath
    }
    nFollower {
      id
      name
      nickname
      intro
      zaloId
      avatar
      isNew
      avatarFilePath
    }
  }
`;
