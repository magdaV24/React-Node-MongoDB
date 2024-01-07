import { useMutation, useQueryClient } from "react-query";
import { CHANGE_STATUS } from "../../api/urls";
import usePostDataWithToken from "../usePostDataWithToken";

interface ChangeStatusInput {
  id: string;
  user_id: string;
  book_id: string;
}

function useChangeStatusMutation() {
  const queryClient = useQueryClient();
  const postData = usePostDataWithToken();
  const mutation = useMutation(
    async (input: ChangeStatusInput) => await postData(CHANGE_STATUS, input),
    {
      onSuccess: (context) => {
        const input = context?.input;
        queryClient.invalidateQueries(
          `labelQuery/${input?.user_id}/${input?.book_id}`
        );
      },
      onMutate: async (input: ChangeStatusInput) => {
        const context = { input };
        return context;
      }
    }
  );

  const changeStatusLoading = mutation.isLoading;
  return { mutation, changeStatusLoading };
}

export default function useChangeStatus() {
  const { mutation, changeStatusLoading } = useChangeStatusMutation();

  const change_status = async (input: ChangeStatusInput) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  return { change_status, changeStatusLoading };
}
