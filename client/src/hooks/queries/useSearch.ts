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
  }, [isLoading, authContext]);

  return { data, isLoading, error };
};
