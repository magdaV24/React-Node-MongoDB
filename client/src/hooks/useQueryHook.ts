import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";
import useFetchData from "./useFetchData";
import { useAppContext } from "./useAppContext";

export default function useQueryHook(
  url: string,
  queryKey: string,
  queriesToInvalidate?: string[]
) {
  const fetchData = useFetchData();
  const appContext = useAppContext();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(queryKey, async () => {
    const result = await fetchData(url);
    return result;
  });

  queriesToInvalidate &&
    queriesToInvalidate.length > 0 &&
    queryClient.invalidateQueries(queriesToInvalidate);

  useEffect(() => {
    if (isLoading) {
      appContext.setOpenBackdrop(true);
    } else {
      appContext.setOpenBackdrop(false);
    }
    if (error) {
      appContext.setError(`Error while fetching data: ${error}`);
    }
  }, []);

  return { data};
}
