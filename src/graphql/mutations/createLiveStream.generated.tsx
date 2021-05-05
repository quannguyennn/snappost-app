import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CreateLiveStreamMutationVariables = Types.Exact<{ [key: string]: never }>;

export type CreateLiveStreamMutationResponse = { __typename?: 'Mutation' } & {
  createLiveStream: { __typename?: 'LiveStream' } & Pick<
    Types.LiveStream,
    'id' | 'streamerId' | 'streamUrl' | 'viewUrl' | 'status' | 'createdAt' | 'updatedAt'
  >;
};

export const CreateLiveStreamDocument = gql`
  mutation createLiveStream {
    createLiveStream {
      id
      streamerId
      streamUrl
      viewUrl
      status
      createdAt
      updatedAt
    }
  }
`;
export function useCreateLiveStreamMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateLiveStreamMutationResponse, CreateLiveStreamMutationVariables>,
) {
  return Apollo.useMutation<CreateLiveStreamMutationResponse, CreateLiveStreamMutationVariables>(
    CreateLiveStreamDocument,
    baseOptions,
  );
}
export type CreateLiveStreamMutationHookResult = ReturnType<typeof useCreateLiveStreamMutation>;
export type CreateLiveStreamMutationResult = Apollo.MutationResult<CreateLiveStreamMutationResponse>;
export type CreateLiveStreamMutationOptions = Apollo.BaseMutationOptions<
  CreateLiveStreamMutationResponse,
  CreateLiveStreamMutationVariables
>;
