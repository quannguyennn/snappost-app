import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ChangeStreamStatusMutationVariables = Types.Exact<{
  status: Types.LiveStreamStatusEnum;
  id: Types.Scalars['Float'];
}>;

export type ChangeStreamStatusMutationResponse = { __typename?: 'Mutation' } & {
  changeStreamStatus: { __typename?: 'LiveStream' } & Pick<
    Types.LiveStream,
    | 'id'
    | 'streamerId'
    | 'streamUrl'
    | 'viewUrl'
    | 'status'
    | 'previewUrl'
    | 'muxStreamId'
    | 'muxPlaybackId'
    | 'createdAt'
    | 'updatedAt'
  > & { streamerInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'name' | 'avatarFilePath'> };
};

export const ChangeStreamStatusDocument = gql`
  mutation changeStreamStatus($status: LiveStreamStatusEnum!, $id: Float!) {
    changeStreamStatus(status: $status, id: $id) {
      id
      streamerId
      streamUrl
      viewUrl
      status
      previewUrl
      muxStreamId
      muxPlaybackId
      createdAt
      updatedAt
      streamerInfo {
        id
        name
        avatarFilePath
      }
    }
  }
`;
export function useChangeStreamStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangeStreamStatusMutationResponse, ChangeStreamStatusMutationVariables>,
) {
  return Apollo.useMutation<ChangeStreamStatusMutationResponse, ChangeStreamStatusMutationVariables>(
    ChangeStreamStatusDocument,
    baseOptions,
  );
}
export type ChangeStreamStatusMutationHookResult = ReturnType<typeof useChangeStreamStatusMutation>;
export type ChangeStreamStatusMutationResult = Apollo.MutationResult<ChangeStreamStatusMutationResponse>;
export type ChangeStreamStatusMutationOptions = Apollo.BaseMutationOptions<
  ChangeStreamStatusMutationResponse,
  ChangeStreamStatusMutationVariables
>;
