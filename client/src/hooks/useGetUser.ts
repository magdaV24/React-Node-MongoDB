import { useMemo } from "react";
import { User } from "../types/User";
import { FETCH_USER } from "../utils/urls";
import useQueryWithToken from "./useQueryWithToken";

export default function useGetUser(id: string | null) {
  const queryKey = useMemo(() => id ? `userQuery/${id}` : null, [id]);
  const url = useMemo(() => id ? `${FETCH_USER}/${id}` : null, [id]);
  const user = useQueryWithToken(url, queryKey)?.data as User;
  return user;
}