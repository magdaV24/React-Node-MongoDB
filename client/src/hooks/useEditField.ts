import { useEditFieldMutation } from "./mutations/useEditFieldMutation";

export default function useEditField() {
    const mutation = useEditFieldMutation()
  
    const edit_field = async (input: unknown) => {
      try {
        await mutation.mutateAsync(input);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    return edit_field;
  }