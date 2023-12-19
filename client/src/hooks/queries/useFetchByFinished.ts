import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import fetchData from "../../functions/fetchData";
import { useEffect } from "react";
import { SHOW_FINISHED } from "../../api/urls";

export const useFetchByFinished = (book_id: string, finished: string) => {
  const authContext = useAuthContext();

  const {
    data: reviewsByFinished,
    isLoading,
    error,
    refetch: refetchByFinished
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
  }, [isLoading, authContext]);

  return { reviewsByFinished, error, refetchByFinished }
};
