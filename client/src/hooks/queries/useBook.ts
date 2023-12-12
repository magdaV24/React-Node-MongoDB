import { useQuery } from "react-query"
import fetchData from "../../functions/fetchData"
import { FETCH_BOOK } from "../../api/urls"
import { useAuthContext } from "../useAuthContext"
import { useEffect } from "react"

export const useBook = (input: string) => {
    const authContext = useAuthContext();
    const { data, isLoading, error } = useQuery(
        "bookQuery",
        async () => {
          const result = await fetchData(`${FETCH_BOOK}/${input}`);
          authContext.setBook(result)
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
}