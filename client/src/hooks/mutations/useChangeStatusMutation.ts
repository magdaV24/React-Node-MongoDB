import { useMutation, useQueryClient } from "react-query";
import { CHANGE_STATUS } from "../../api/urls";
import usePostDataWithToken from "../usePostDataWithToken";
import { StatusInput } from "./useAddStatusMutation";


function useChangeStatusMutation() {
  const queryClient = useQueryClient();
  const postData = usePostDataWithToken();
  const mutation = useMutation(
    async (input: StatusInput) => await postData(CHANGE_STATUS, input),
    {
      onSuccess: (context) => {
        const input = context?.input;
        queryClient.invalidateQueries(
          `labelQuery/${input?.user_id}/${input?.book_id}`
        );
      },
      onMutate: async (input: StatusInput) => {
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

  const change_status = async (input: StatusInput) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  return { change_status, changeStatusLoading };
}
