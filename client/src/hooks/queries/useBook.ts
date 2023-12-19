import { useQuery } from "react-query"
import fetchData from "../../functions/fetchData"
import { FETCH_BOOK } from "../../api/urls"
import { useAuthContext } from "../useAuthContext"
import { useEffect } from "react"

export const useBook = (input: string) => {
    const authContext = useAuthContext();
    const { data, isLoading, error } = useQuery(
        `bookQuery/${input}`,
        async () => {
          const result = await fetchData(`${FETCH_BOOK}/${input}`);
          authContext.setBook(result)
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