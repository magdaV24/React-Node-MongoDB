import { useEffect } from "react";
import { useQuery } from "react-query";
import { FIND_STATUS } from "../../api/urls";
import fetchData from "../../functions/fetchData";
import { useAuthContext } from "../useAuthContext";

export const useLabel = (user_id: string, book_id: string) => {
  const authContext = useAuthContext();

  const { data, isLoading, error } = useQuery(
    "labelQuery",
    async () => {
      const result = await fetchData(`${FIND_STATUS}/${user_id}/${book_id}`);
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
