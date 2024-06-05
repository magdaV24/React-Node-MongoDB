import { useQuery } from "react-query";
import { useEffect } from "react";
import { useAppContext } from "./useAppContext";
import useFetchDataWithToken from "./useFetchDataWithToken";

export default function useQueryWithToken(url: string, queryKey: string) {
  const fetchData = useFetchDataWithToken();
  const appContext = useAppContext();
  const { data, error, isLoading } = useQuery(
    queryKey,
    async () => {
      const result = await fetchData(url);
      return result;
    },
  );
  useEffect(() => {
    if (isLoading) {
        appContext.setOpenBackdrop(true);
    }else {
      appContext.setOpenBackdrop(false);
    }
    if (error) {
      appContext.setError(error as string);
    }
  }, [isLoading, error, appContext]);
  return { data };
}
