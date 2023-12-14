import { useEffect } from "react";
import { useQuery } from "react-query";
import { CHECK_IF_LIKED } from "../../api/urls";
import fetchData from "../../functions/fetchData";
import { useAuthContext } from "../useAuthContext";

export const useIsLiked = (user_id: string, object_id: string) => {
  const authContext = useAuthContext();

  const {
    data: liked,
    isLoading,
    error,
  } = useQuery(
    `isLikedQuery/${user_id}/${object_id}`,
    async () => {
      const result = await fetchData(
        `${CHECK_IF_LIKED}/${user_id}/${object_id}`
      );
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

  return liked;
};
