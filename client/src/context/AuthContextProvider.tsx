import { createContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/AuthContextType";
import { AuthContextProviderType } from "../types/AuthContextProviderType";
import { createTheme } from "@mui/material";
import { CustomDarkTheme } from "../themes/Dark";
import { CustomLightTheme } from "../themes/Light";
import useLogin from "../hooks/mutations/useLoginMutation";

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({ children }: AuthContextProviderType) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")!) || null
  );
  const [book, setBook] = useState(
    JSON.parse(localStorage.getItem("book")!) || null
  );
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")!) || "Dark"
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")!) || null
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const clearMessage = () => {
    setMessage("");
  };

  const clearError = () => {
    setError("");
  };

  const handleCloseMessage = () => {
    clearMessage();
    setOpenMessage(false);
  };

  const handleCloseError = () => {
    clearError();
    setOpenError(false);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  const light = createTheme(CustomLightTheme);
  const dark = createTheme(CustomDarkTheme);

  const toggle_theme = () => {
    if (theme === "Light") {
      setTheme("Dark");
    } else {
      setTheme("Light");
    }
  };

  const currentTheme = theme === "Light" ? light : dark;

  const { login } = useLogin();
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("theme", JSON.stringify(theme));
    localStorage.setItem("book", JSON.stringify(book));
    localStorage.setItem("token", JSON.stringify(token));
  }, [currentUser, theme, book, token]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        setToken,
        currentTheme,
        disabled,
        setDisabled,
        logout,
        toggle_theme,
        message,
        error,
        setCurrentUser,
        setMessage,
        setError,
        login,
        book,
        setBook,
        openMessage,
        openError,
        openBackdrop,
        setOpenBackdrop,
        setOpenMessage,
        setOpenError,
        clearError,
        clearMessage,
        handleCloseError,
        handleCloseMessage,
        handleCloseBackdrop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
