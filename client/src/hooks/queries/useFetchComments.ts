import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { FETCH_COMMENTS } from "../../api/urls";
import { useEffect } from "react";
import useFetchData from "../useFetchData";

export default function useFetchComments(input: string) {
  const fetchData = useFetchData();
  const authContext = useAuthContext();
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery(
    `fetchComments/${input}`,
    async () => {
      const result = await fetchData(`${FETCH_COMMENTS}/${input}`);
      return result;
    },
    {
      onSettled: () => {
        setTimeout(() => authContext.setOpenBackdrop(false), 0);
      },
    }
  );

  useEffect(() => {
    if (isLoading) {
      authContext.setOpenBackdrop(true);
    }
    if (error) {
      authContext.setError(`Error: ${error}`);
    }
  }, [isLoading, authContext, error]);

  return { comments };
}
