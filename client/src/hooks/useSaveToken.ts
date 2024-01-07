import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";

export function useSaveToken() {
  const authContext = useAuthContext();
  const saveToken = (token: string) => {
    const decodedToken = jwtDecode(token);
    const expiration = decodedToken.exp! * 1000;
    authContext.setToken({ token: decodedToken, expiration: expiration });
  };
  return saveToken;
}
