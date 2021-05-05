import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetStreamsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetStreamsQueryResponse = { __typename?: 'Query' } & {
  getStreams: Array<
    { __typename?: 'LiveStream' } & Pick<
      Types.LiveStream,
      'id' | 'streamerId' | 'streamUrl' | 'viewUrl' | 'status' | 'createdAt' | 'updatedAt'
    > & { streamerInfo: { __typename?: 'User' } & Pick<Types.User, 'id' | 'avatarFilePath'> }
  >;
};

export const GetStreamsDocument = gql`
  query getStreams {
    getStreams {
      id
      streamerId
      streamUrl
      viewUrl
      status
      createdAt
      updatedAt
      streamerInfo {
        id
        avatarFilePath
      }
    }
  }
`;
export function useGetStreamsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetStreamsQueryResponse, GetStreamsQueryVariables>,
) {
  return Apollo.useQuery<GetStreamsQueryResponse, GetStreamsQueryVariables>(GetStreamsDocument, baseOptions);
}
export function useGetStreamsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStreamsQueryResponse, GetStreamsQueryVariables>,
) {
  return Apollo.useLazyQuery<GetStreamsQueryResponse, GetStreamsQueryVariables>(GetStreamsDocument, baseOptions);
}
export type GetStreamsQueryHookResult = ReturnType<typeof useGetStreamsQuery>;
export type GetStreamsLazyQueryHookResult = ReturnType<typeof useGetStreamsLazyQuery>;
export type GetStreamsQueryResult = Apollo.QueryResult<GetStreamsQueryResponse, GetStreamsQueryVariables>;
