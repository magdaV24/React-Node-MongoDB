import { useMutation } from "react-query";
import { LOGIN } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostData from "../usePostData";
import { useSaveToken } from "../useSaveToken";

function useLoginMutation(){
  const postData = usePostData();
  const saveToken = useSaveToken();
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(LOGIN, input),
    {
      onSuccess: (data) => {
        authContext.setCurrentUser(data);
        authContext.setMessage("Logged in successfully!");
        saveToken(data.token);
      },
      onError: () => {
        authContext.setCurrentUser(null);
        authContext.setToken(null);
      },
    }
  );

  const loginLoading = mutation.isLoading;
  return {mutation, loginLoading};
}

export default function useLogin() {
  const {mutation, loginLoading} = useLoginMutation();

  const login = async (input: unknown) => {
    try {
    await  mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error on useLogin: ${error}`);
    }
  };
  return {login, loginLoading};
}
