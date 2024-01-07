import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { useAuthContext } from "./useAuthContext";

export const useCheckToken = () => {
  const { token } = useContext(AuthContext);
  const authContext = useAuthContext();

  const checkToken = () => {
    if (token) {
      const currentTime = Date.now();
      if (currentTime > token.expiration) {
        authContext.setCurrentUser(null);
        authContext.setToken(null);
      }
    }
  };
  return checkToken;
};
