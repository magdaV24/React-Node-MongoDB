import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";
import useFetchData from "./useFetchData";
import { useAppContext } from "./useAppContext";

export default function useQueryHook(url: string, queryName: string, queriesToInvalidate?: string[]) {
  const fetchData = useFetchData();
  const appContext = useAppContext();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    queryName,
    async () => {
      const result = await fetchData(url);
      return result;
    },
  );

  queryClient.invalidateQueries(queriesToInvalidate);

  useEffect(() => {
    if (isLoading) {
        appContext.setOpenBackdrop(true);
    }
    if (error) {
      appContext.setError(`Error while fetching data: ${error}`);
    }
  }, [isLoading, error, appContext]);
  return { data };
}
