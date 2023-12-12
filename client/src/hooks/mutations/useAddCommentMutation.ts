import { useMutation } from "react-query";
import { ADD_COMMENT } from "../../api/urls";
import postData from "../../functions/postData";
import { useAuthContext } from "../useAuthContext";

export const useAddReviewMutation = () => {
    const authContext = useAuthContext();
    const mutation = useMutation(
      async (input: unknown) => await postData(ADD_COMMENT, input),
      {
        onSuccess: (res) => {
            authContext.setMessage(res);
        },
        onError: (error) => {
          authContext.setError(error as string);
        },
        onSettled: () => authContext.setLoading(false),
      }
    );
    mutation.isLoading ? authContext.setLoading(true) : null;
    return mutation;
  };