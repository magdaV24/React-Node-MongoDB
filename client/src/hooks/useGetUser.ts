import { useMemo } from "react";
import { User } from "../types/User";
import { FETCH_USER } from "../utils/urls";
import useQueryWithToken from "./useQueryWithToken";

export default function useGetUser(id: string | null, enabled?: boolean) {
  const queryKey = useMemo(() => (id ? `userQuery/${id}` : ''), [id]);
  const url = useMemo(() => (id ? `${FETCH_USER}/${id}` : ''), [id]);

  const { data } = useQueryWithToken(url, queryKey, enabled);

  return data as User | null;
}