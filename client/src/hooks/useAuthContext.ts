import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { AuthContextType } from "../types/AuthContextType";

export const useAuthContext = (): AuthContextType => {
    const authContext = useContext(AuthContext);
    return authContext;
}