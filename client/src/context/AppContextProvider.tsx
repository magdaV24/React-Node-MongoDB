import { createContext, useEffect, useState } from "react";
import { AppContextType } from "../types/AppContextType";
import { AppContextProviderType } from "../types/AppContextProviderType";
import { createTheme } from "@mui/material";
import { LightTheme } from "../styles/themes/lightTheme";
import { DarkTheme } from "../styles/themes/darkTheme";

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = ({ children }: AppContextProviderType) => {
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("Theme")!) || "Dark"
  );

  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("Token")!) || null
  );

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const [error, setError] = useState("");
  const [openErrorAlert, setOpenErrorAlert] = useState(false);

  const handleCloseErrorAlert = () => {
    setOpenErrorAlert(false);
  };

  const clearErrorMessage = () => {
    setError("");
  };

  const [success, setSuccess] = useState("");
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);

  const handleCloseSuccessAlert = () => {
    setOpenSuccessAlert(false);
  };

  const clearSuccessMessage = () => {
    setSuccess("");
  };

  const lightTheme = createTheme(LightTheme);
  const darkTheme = createTheme(DarkTheme);

  function toggleTheme() {
    if (theme === "Light") {
      setTheme("Dark");
    } else {
      setTheme("Light");
    }
  }
 
  const currentTheme = theme === "Light" ? lightTheme : darkTheme;

  const [bookNumber, setBookNumber] = useState(0);

  const increment =()=>{
    setBookNumber(prev=> prev++)
  }

  useEffect(() => {
    localStorage.setItem("Theme", JSON.stringify(theme));
  }, [theme]);
  return (
    <AppContext.Provider
      value={{
        bookNumber,
        increment,
        token,
        setToken,
        currentTheme,
        toggleTheme,
        openBackdrop,
        setOpenBackdrop,
        handleCloseBackdrop,
        error,
        setError,
        openErrorAlert,
        setOpenErrorAlert,
        handleCloseErrorAlert,
        clearErrorMessage,
        success,
        setSuccess,
        openSuccessAlert,
        setOpenSuccessAlert,
        handleCloseSuccessAlert,
        clearSuccessMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
