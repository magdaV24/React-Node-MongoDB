import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import fetchData from "../../functions/fetchData";
import { useEffect } from "react";
import { SHOW_STARS } from "../../api/urls";

export const useFetchByStars = (book_id: string, stars: string) => {
  const authContext = useAuthContext();

  const {
    data: reviewsByStars,
    isLoading,
    error,
    refetch: refetchByStars
  } = useQuery(
    `fetchReviews/${book_id}/${stars}`,
    async () => {
      const result = await fetchData(`${SHOW_STARS}/${book_id}/${stars}`);
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

  return { reviewsByStars, error, refetchByStars }
};
