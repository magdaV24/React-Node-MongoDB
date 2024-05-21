import { QueryClient, useMutation } from "react-query";
import { useAppContext } from "./useAppContext";
import usePostDataWithToken from "./usePostDataWithToken";

const useDataMutation = (url: string, queryToInvalidate?: string) => {
  const postData = usePostDataWithToken();
  const appContext = useAppContext();
  const queryClient = new QueryClient();
  const mutation = useMutation(
    async (input: unknown) => {
      const response = await postData(url, input);
      queryClient.invalidateQueries(queryToInvalidate);
      return response?.data;
    },
    {
      onError: (error) => {
        appContext.setError(error as string);
        appContext.setOpenErrorAlert(true);
      },
    }
  );
  const loading = mutation.isLoading;
  return { mutation, loading };
};

export default function useMutationWithToken(
  url: string,
  queryToInvalidate?: string
) {
  const appContext = useAppContext();
  const { mutation, loading } = useDataMutation(url, queryToInvalidate);

  const postData = async (input: unknown) => {
    try {
      const res = await mutation.mutateAsync(input);
      return res;
    } catch (error) {
      appContext.setError(`${error}`);
      appContext.setOpenErrorAlert(true)
    }
  };
  return { postData, loading };
}
