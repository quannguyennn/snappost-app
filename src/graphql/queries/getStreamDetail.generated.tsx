import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetStreamDetailQueryVariables = Types.Exact<{
  id: Types.Scalars['Float'];
}>;

export type GetStreamDetailQueryResponse = { __typename?: 'Query' } & {
  getStreamDetail: { __typename?: 'LiveStream' } & Pick<
    Types.LiveStream,
    'id' | 'streamerId' | 'streamUrl' | 'viewUrl' | 'status' | 'createdAt' | 'updatedAt'
  >;
};

export const GetStreamDetailDocument = gql`
  query getStreamDetail($id: Float!) {
    getStreamDetail(id: $id) {
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
export function useGetStreamDetailQuery(
  baseOptions: Apollo.QueryHookOptions<GetStreamDetailQueryResponse, GetStreamDetailQueryVariables>,
) {
  return Apollo.useQuery<GetStreamDetailQueryResponse, GetStreamDetailQueryVariables>(
    GetStreamDetailDocument,
    baseOptions,
  );
}
export function useGetStreamDetailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStreamDetailQueryResponse, GetStreamDetailQueryVariables>,
) {
  return Apollo.useLazyQuery<GetStreamDetailQueryResponse, GetStreamDetailQueryVariables>(
    GetStreamDetailDocument,
    baseOptions,
  );
}
export type GetStreamDetailQueryHookResult = ReturnType<typeof useGetStreamDetailQuery>;
export type GetStreamDetailLazyQueryHookResult = ReturnType<typeof useGetStreamDetailLazyQuery>;
export type GetStreamDetailQueryResult = Apollo.QueryResult<
  GetStreamDetailQueryResponse,
  GetStreamDetailQueryVariables
>;
