import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { SEARCH } from "../../api/urls";
import { useEffect } from "react";
import useFetchData from "../useFetchData";

export default function useSearch(input: string)  {
  const fetchData = useFetchData();
  const authContext = useAuthContext();
  const { data, isLoading, error } = useQuery(
    "searchQuery",
    async () => {
      const result = await fetchData(`${SEARCH}/${input}`);
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