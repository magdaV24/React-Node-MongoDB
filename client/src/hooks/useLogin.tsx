import { useLoginMutation } from "./mutations/useLoginMutation";

export default function useLogin() {
  const mutation = useLoginMutation();

  const login = async (input: unknown) => {
    try {
    await  mutation.mutateAsync(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return login;
}
