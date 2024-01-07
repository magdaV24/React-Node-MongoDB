import { useQuery } from "react-query";
import { FETCH_BOOK } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import { useEffect } from "react";
import useFetchData from "../useFetchData";

export default function useBook(input: string) {
  const authContext = useAuthContext();
  const fetchData = useFetchData();
  const { data, isLoading, error } = useQuery(
    `bookQuery/${input}`,
    async () => {
      const result = await fetchData(`${FETCH_BOOK}/${input}`);
      authContext.setBook(result);
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

  return { data };
}