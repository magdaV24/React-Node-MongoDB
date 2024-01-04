import { useAddStatusMutation } from "./mutations/useAddStatusMutation";

export default function useAddStatus() {
    const {mutation, statusLoading} = useAddStatusMutation();
  
    const add_status = async (input: unknown) => {
      try {
      await  mutation.mutateAsync(input);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return {add_status, statusLoading};
  }