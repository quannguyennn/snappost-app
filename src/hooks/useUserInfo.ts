import { GetUserInfoDocument, GetUserInfoQueryResponse } from "../graphql/queries/getUserInfo.generated";
import { useApolloClient } from '@apollo/client';

export const useUserInfo = (id :any) => {
  const client = useApolloClient();
  try {
    const data = client.readQuery<GetUserInfoQueryResponse>({
      variables: ({
        id
      }),
      query: GetUserInfoDocument,
    });
    return data?.getUserInfo;
  } catch {
    return undefined;
  }
};
