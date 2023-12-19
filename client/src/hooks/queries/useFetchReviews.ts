import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import fetchData from "../../functions/fetchData";
import { FETCH_REVIEWS } from "../../api/urls";
import { useEffect } from "react";

export const useFetchReviews = (book_id: string, enabled: boolean = true) => {
  const authContext = useAuthContext();

  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useQuery(
    `fetchReviews/${book_id}`,
    async () => {
      const result = await fetchData(`${FETCH_REVIEWS}/${book_id}`);
      return result;
    },
    {
      enabled: enabled, 
      onSettled: () => {
        setTimeout(() => authContext.setOpenBackdrop(false), 0);
      },
    }
  );
  useEffect(() => {
    if (isLoading && enabled) {
      authContext.setOpenBackdrop(true);
    }
  }, [isLoading, authContext, enabled]);

  return { reviews, error, refetch }
};
