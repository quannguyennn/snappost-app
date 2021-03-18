import type * as Types from '../type.interface';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ReportPostMutationVariables = Types.Exact<{
  postId: Types.Scalars['Float'];
}>;

export type ReportPostMutationResponse = { __typename?: 'Mutation' } & Pick<Types.Mutation, 'reportPost'>;

export const ReportPostDocument = gql`
  mutation reportPost($postId: Float!) {
    reportPost(postId: $postId)
  }
`;
export function useReportPostMutation(
  baseOptions?: Apollo.MutationHookOptions<ReportPostMutationResponse, ReportPostMutationVariables>,
) {
  return Apollo.useMutation<ReportPostMutationResponse, ReportPostMutationVariables>(ReportPostDocument, baseOptions);
}
export type ReportPostMutationHookResult = ReturnType<typeof useReportPostMutation>;
export type ReportPostMutationResult = Apollo.MutationResult<ReportPostMutationResponse>;
export type ReportPostMutationOptions = Apollo.BaseMutationOptions<
  ReportPostMutationResponse,
  ReportPostMutationVariables
>;
