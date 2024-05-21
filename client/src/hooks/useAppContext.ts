import { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";
import { AppContextType } from "../types/AppContextType";

export const useAppContext = (): AppContextType => {
  const appContext = useContext(AppContext);
  return appContext;
};
