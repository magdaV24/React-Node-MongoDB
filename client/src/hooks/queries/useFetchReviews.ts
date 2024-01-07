import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { FETCH_REVIEWS } from "../../api/urls";
import { useEffect } from "react";
import useFetchData from "../useFetchData";

export default function useFetchReviews(
  book_id: string,
  enabled: boolean = true
) {
  const fetchData = useFetchData();
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
    if (isLoading) {
      authContext.setOpenBackdrop(true);
    }
    if (error) {
      authContext.setError(`Error: ${error}`);
    }
  }, [isLoading, authContext, error]);

  return { reviews, refetch };
}
