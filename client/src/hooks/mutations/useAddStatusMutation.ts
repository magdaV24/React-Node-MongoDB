import { useMutation, useQueryClient } from "react-query";
import { ADD_READING_STATUS } from "../../api/urls";
import usePostData from "../usePostData";

export interface StatusInput {
  status: string;
  user_id: string;
  book_id: string;
}

function useAddStatusMutation () {
  const queryClient = useQueryClient();
  const postData = usePostData();
  const mutation = useMutation(
    async (input: StatusInput) => await postData(ADD_READING_STATUS, input),
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

  const statusLoading = mutation.isLoading;
  return {mutation, statusLoading};
}

export default function useAddStatus() {
  const {mutation, statusLoading} = useAddStatusMutation();

  const add_status = async (input: StatusInput) => {
    try {
    await  mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  };
  return {add_status, statusLoading};
}
