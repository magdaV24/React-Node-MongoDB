import { useQuery } from "react-query";
import { useAuthContext } from "../useAuthContext"
import fetchData from "../../functions/fetchData";
import { FETCH_COMMENTS } from "../../api/urls";
import { useEffect } from "react";

export const useFetchComments = (input: string) => {
    const authContext = useAuthContext();
    const { data: comments, isLoading, error } = useQuery(
        `fetchComments/${input}`,
        async () => {
            const result = await fetchData(`${FETCH_COMMENTS}/${input}`)
            authContext.setLoading(false);
      return result;
        },
        {
          onSettled: () => {
            setTimeout(() => authContext.setLoading(false), 0);
          },
        }
    )
    useEffect(() => {
        if (isLoading) {
          authContext.setLoading(true);
        }
      }, [isLoading, authContext]);
    
      return { comments, isLoading, error };
}