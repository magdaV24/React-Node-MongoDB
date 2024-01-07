import { useEffect } from "react";
import { useQuery } from "react-query";
import { COUNT_LIKES } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import { LikeInput } from "../../interfaces/LikeInput";
import useFetchData from "../useFetchData";

export default function useFetchLikesCount(input: LikeInput) {
  const authContext = useAuthContext();
  const fetchData = useFetchData();

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
      authContext.setError(`Error: ${error}`);
    }
  }, [isLoading, authContext, error]);

  return { count };
}
