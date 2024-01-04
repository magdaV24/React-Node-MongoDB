import { useQuery } from "react-query";
import fetchData from "../../functions/fetchData";
import { FETCH_BOOKS } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import { useEffect } from "react";

export const useFetchBooks = () => {
  const authContext = useAuthContext();

  const { data, isLoading, error } = useQuery(
    "booksQuery",
    async () => {
      const result = await fetchData(FETCH_BOOKS);
      authContext.setLoading(false);
      return result;
    },
    {
      onSettled: () => {
        setTimeout(() => (authContext.setOpenBackdrop(false), 0))
      },
    }
  );

  useEffect(() => {
    if (isLoading) {
      authContext.setOpenBackdrop(true)
    }
  }, [isLoading, authContext]);

  return { data, isLoading, error };
};
