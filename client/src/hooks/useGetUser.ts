import { User } from "../types/User";
import { FETCH_USER } from "../utils/urls";
import useQueryWithToken from "./useQueryWithToken";

export default function useGetUser(id: string | null) {
  const queryName = `userQuery/${id}`;
  const url = `${FETCH_USER}/${id}`;
  const user = useQueryWithToken(url, queryName).data as User;
  return user;
}
