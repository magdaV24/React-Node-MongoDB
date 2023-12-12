import { useRegistrationMutation } from "./mutations/useRegistrationMutation";


export default function useRegister() {
  const mutation = useRegistrationMutation();

  const register = async (input: unknown) => {
    try {
      await mutation.mutateAsync(input)
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return register;
}
