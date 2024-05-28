import { jwtDecode } from "jwt-decode";
import { Token } from "../types/Token";

export function useToken(setToken: (token: string)=>void,  reloadWindow = () => window.location.reload()) {
  const saveToken = (token: string) => {
    const decodedToken = jwtDecode(token) as Token;

    if (decodedToken!.rememberMe) {
      localStorage.setItem("Token", JSON.stringify(token));
    } else {
      sessionStorage.setItem("Token", JSON.stringify(token));
    }
  };

  const checkToken = (token: string) => {
    if (!token) return;
    const decodedToken = jwtDecode(token) as Token;
    const expiration = decodedToken!.exp * 1000;
    const currentTime = Date.now();
    if (currentTime > expiration) {
      setToken("");
      if (decodedToken?.rememberMe) {
        localStorage.removeItem("Token");
      } else {
        sessionStorage.removeItem("Token");
      }
    }
  };

  const logout = (token: string) => {
    if (!token) return;
    const decodedToken = jwtDecode(token) as Token;
    setToken("");
    if (decodedToken?.rememberMe) {
    localStorage.removeItem("Token");
    } else {
      sessionStorage.removeItem("Token");
    }
    reloadWindow();
  };

  const setTheToken = () => {
    const localStorageToken = localStorage.getItem("Token");
    const sessionStorageToken = sessionStorage.getItem("Token");

    if (localStorageToken) {
      const token = JSON.parse(localStorageToken);
      setToken(token)
    } else if (sessionStorageToken) {
      const token = JSON.parse(sessionStorageToken);
      setToken(token)
    }
  };

  const getUserId = (token: string) => {
    if (!token) return null;
    const decodedToken = jwtDecode(token) as Token;
    return decodedToken!.id;
  };


  return { saveToken, getUserId, checkToken, setTheToken, logout, reloadWindow };
}

