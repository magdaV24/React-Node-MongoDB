import { useChangeStatusMutation } from "./mutations/useChangeStatusMutation";

export default function useChangeStatus() {
    const mutation = useChangeStatusMutation()
  
    const change_status = async (input: unknown) => {
      try {
      await  mutation.mutateAsync(input);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return change_status;
  }