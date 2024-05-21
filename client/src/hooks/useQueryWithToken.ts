import { useQuery } from "react-query";
import { useEffect } from "react";
import { useAppContext } from "./useAppContext";
import useFetchDataWithToken from "./useFetchDataWithToken";

export default function useQueryWithToken(url: string, queryName: string) {
  const fetchData = useFetchDataWithToken();
  const appContext = useAppContext();
  const { data, error, isLoading } = useQuery(
    queryName,
    async () => {
      const result = await fetchData(url);
      return result;
    }
  );
  useEffect(() => {
    if (isLoading) {
        appContext.setOpenBackdrop(true);
    }
    if (error) {
      appContext.setError(error as string);
    }
  }, [isLoading, error, appContext]);
  return { data };
}
