import type * as Types from '../type.interface';

import type { UserFragmentFragment } from '../fragments/UserFragment.generated';
import { gql } from '@apollo/client';
import { UserFragmentFragmentDoc } from '../fragments/UserFragment.generated';
import * as Apollo from '@apollo/client';
export type CreatePostMutationVariables = Types.Exact<{
  input: Types.CreatePostInput;
}>;

export type CreatePostMutationResponse = { __typename?: 'Mutation' } & {
  createPost: { __typename?: 'Post' } & Pick<
    Types.Post,
    'id' | 'creatorId' | 'medias' | 'caption' | 'createdAt' | 'updatedAt'
  > & { creatorInfo?: Types.Maybe<{ __typename?: 'User' } & UserFragmentFragment> };
};

export const CreatePostDocument = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      creatorId
      medias
      caption
      createdAt
      updatedAt
      creatorInfo {
        ...UserFragment
      }
    }
  }
  ${UserFragmentFragmentDoc}
`;
export function useCreatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<CreatePostMutationResponse, CreatePostMutationVariables>,
) {
  return Apollo.useMutation<CreatePostMutationResponse, CreatePostMutationVariables>(CreatePostDocument, baseOptions);
}
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutationResponse>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<
  CreatePostMutationResponse,
  CreatePostMutationVariables
>;
