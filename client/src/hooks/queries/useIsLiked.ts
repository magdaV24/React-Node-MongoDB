import { useEffect } from "react";
import { useQuery } from "react-query";
import { CHECK_IF_LIKED } from "../../api/urls";
import fetchData from "../../functions/fetchData";
import { useAuthContext } from "../useAuthContext";
import { LikeInput } from "../../interfaces/LikeInput";

export const useIsLiked = (input: LikeInput) => {
  const authContext = useAuthContext();

  const {
    data: liked,
    isLoading,
    error,
  } = useQuery(
    `isLikedQuery/${input.user_id}/${input.object_id}`,
    async () => {
      const result = await fetchData(
        `${CHECK_IF_LIKED}/${input.user_id}/${input.object_id}`
      );
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

  return liked;
};
