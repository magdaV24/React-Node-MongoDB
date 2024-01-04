import { useEffect } from "react";
import { useQuery } from "react-query";
import { COUNT_LIKES } from "../../api/urls";
import fetchData from "../../functions/fetchData";
import { useAuthContext } from "../useAuthContext";
import { LikeInput } from "../../interfaces/LikeInput";

export const useFetchLikesCount = (input: LikeInput) => {
  const authContext = useAuthContext();

  const {
    data: count,
    isLoading,
    error,
  } = useQuery(
    `likesCountQuery/${input.object_id}`,
    async () => {
      const result = await fetchData(`${COUNT_LIKES}/${input.object_id}`);
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
      authContext.setError(error as string);
      authContext.setOpenError(true);
    }
  }, [isLoading, authContext, error]);

  return { count };
};
