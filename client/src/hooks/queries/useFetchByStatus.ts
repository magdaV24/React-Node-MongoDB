import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext";
import { useEffect } from "react";
import { FETCH_BY_STATUS } from "../../api/urls";
import useFetchData from "../useFetchData";

export default function useFetchByStatus(user_id: string, field: string) {
  const fetchData = useFetchData();
  const authContext = useAuthContext();
  const { data, isLoading, error } = useQuery(
    `fetchByUser/${user_id}/${field}`,
    async () => {
      const result = await fetchData(`${FETCH_BY_STATUS}/${user_id}/${field}`);
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
