import { useMutation, useQueryClient } from "react-query";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";
import { CHANGE_STATUS } from "../../api/urls";

interface ChangeStatusInput{
  id: string,
  user_id: string;
  book_id: string;
}

export const useChangeStatusMutation = () => {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (input: ChangeStatusInput) => await postData(CHANGE_STATUS, input),
    { onSuccess: (context) => {
      const input = context?.input;
      queryClient.invalidateQueries(`labelQuery/${input?.user_id}/${input?.book_id}`);
    },
      onMutate: async (input: ChangeStatusInput) => {
        const context = { input };
        return context;
      },
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpenError(true);
      },
      onSettled: () => authContext.setLoading(false),
    }
  );

  mutation.isLoading ? authContext.setLoading(true) : null;
  return mutation;
};
