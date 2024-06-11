import { useQuery } from "react-query";
import { useEffect } from "react";
import { useAppContext } from "./useAppContext";
import useFetchDataWithToken from "./useFetchDataWithToken";

export default function useQueryWithToken(url: string | null, queryKey: string, enabled?: boolean) {
  const fetchData = useFetchDataWithToken();
  const appContext = useAppContext();
  const { data, error, isLoading } = useQuery(queryKey, async () => {
    if (!url) return null;
    const result = await fetchData(url);
    return result;
  },{
    enabled: enabled
  }
);
  useEffect(() => {
    if (isLoading) {
      appContext.setOpenBackdrop(true);
    } else {
      appContext.setOpenBackdrop(false);
    }
    if (error) {
      appContext.setError(error as string);
    }
  }, [isLoading, error, appContext]);
  return { data };
}
