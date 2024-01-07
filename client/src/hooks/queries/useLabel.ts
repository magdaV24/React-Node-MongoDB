import { useEffect } from "react";
import { useQuery } from "react-query";
import { FIND_STATUS } from "../../api/urls";
import { useAuthContext } from "../useAuthContext";
import useFetchDataWithToken from "../useFetchDataWithToken";

export default function useLabel (user_id: string, book_id: string) {
  const authContext = useAuthContext();
  const fetchData = useFetchDataWithToken();

  const { data: label, isLoading, error } = useQuery(
    `labelQuery/${user_id}/${book_id}`,
    async () => {
      const result = await fetchData(`${FIND_STATUS}/${user_id}/${book_id}`);
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
    if(error){
      authContext.setError(`Error: ${error}`)
    }
  }, [isLoading, authContext, error]);

  return { label };
}
