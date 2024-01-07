import { useQuery } from "react-query";
import { FETCH_BOOKS } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import { useEffect } from "react";
import useFetchData from "../useFetchData";

export default function useFetchBooks ()  {
  const authContext = useAuthContext();
  const fetchData = useFetchData();

  const { data, isLoading, error } = useQuery(
    "booksQuery",
    async () => {
      const result = await fetchData(FETCH_BOOKS);
      return result;
    },
    {
      onSettled: () => {
        setTimeout(() => (authContext.setOpenBackdrop(false), 0))
      },
      onError: (error) => {
        authContext.setError(error as string);
        authContext.setOpenError(true);
      }
    }
  );

  useEffect(() => {
    if (isLoading) {
      authContext.setOpenBackdrop(true);
    }
    if(error){
      authContext.setError(`Error: ${error}`)
    }
  }, [isLoading, authContext, error]);
  return { data };
}
