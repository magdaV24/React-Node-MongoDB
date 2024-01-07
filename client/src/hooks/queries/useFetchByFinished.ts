import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { useEffect } from "react";
import { SHOW_FINISHED } from "../../api/urls";
import useFetchData from "../useFetchData";

export default function useFetchByFinished(book_id: string, finished: string) {
  const fetchData = useFetchData();
  const authContext = useAuthContext();

  const {
    data: reviewsByFinished,
    isLoading,
    error,
    refetch: refetchByFinished,
  } = useQuery(
    `fetchReviews/${book_id}/${finished}`,
    async () => {
      const result = await fetchData(`${SHOW_FINISHED}/${book_id}/${finished}`);
      return result;
    },
    {
      enabled: false,
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

  return { reviewsByFinished, refetchByFinished };
}
