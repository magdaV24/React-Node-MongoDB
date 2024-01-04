import { useQuery } from "react-query"
import fetchData from "../../functions/fetchData"
import { useAuthContext } from "../useAuthContext"
import { useEffect } from "react"
import { FETCH_BY_STATUS } from "../../api/urls"

export const useFetchByStatus = (user_id: string, field: string) => {
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
      }, [isLoading, authContext]);
    
      return { data, isLoading, error };
}