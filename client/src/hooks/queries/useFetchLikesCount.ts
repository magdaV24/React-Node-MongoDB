import { useEffect } from "react";
import { useQuery } from "react-query";
import { COUNT_LIKES } from "../../api/urls";
import fetchData from "../../functions/fetchData";
import { useAuthContext } from "../useAuthContext";

export const useFetchLikesCount = (object_id: string) => {
  const authContext = useAuthContext();

  const {
    data: count,
    isLoading,
    error,
  } = useQuery(
    `likesCountQuery/${object_id}`,
    async () => {
      const result = await fetchData(`${COUNT_LIKES}/${object_id}`);
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
    if (error) {
      authContext.setError(error as string);
      authContext.setOpen(true);
    }
  }, [isLoading, authContext, error]);

  return { count };
};
