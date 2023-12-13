import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { SEARCH } from "../../api/urls";
import { useEffect } from "react";
import fetchData from "../../functions/fetchData";

export const useSearch = (input: string) => {
  const authContext = useAuthContext();
  const { data, isLoading, error } = useQuery(
    "searchQuery",
    async () => {
      const result = await fetchData(`${SEARCH}/${input}`);
      authContext.setLoading(false);
      return result;
    },
    {
      onSettled: () => {
        setTimeout(() => authContext.setLoading(false), 0);
      },
    }
  );

  useEffect(() => {
    if (isLoading) {
      authContext.setLoading(true);
    }
  }, [isLoading, authContext]);

  return { data, isLoading, error };
};
