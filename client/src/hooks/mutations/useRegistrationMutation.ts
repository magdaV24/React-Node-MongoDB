import { useMutation } from "react-query";
import { REGISTER } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import usePostData from "../usePostData";
import { useSaveToken } from "../useSaveToken";

function useRegistrationMutation ()  {
  const postData = usePostData();
  const saveToken = useSaveToken();
  const authContext = useAuthContext();
  const mutation = useMutation(
    async (input: unknown) => await postData(REGISTER, input),
    {
      onSuccess: (data) => {
        authContext.setMessage("You registered successfully!");
        authContext.setCurrentUser(data);
        saveToken(data.token);
      },
      onError: () => {
        authContext.setCurrentUser(null);
        authContext.setToken(null);
      },
    }
  );
  const registerLoading = mutation.isLoading;
  return { mutation, registerLoading };
}

export default function useRegister() {
  const { mutation, registerLoading } = useRegistrationMutation();

  const register = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(`Error on useRegister: ${error}`);
    }
  };
  return { register, registerLoading };
}
