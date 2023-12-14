import { createContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/AuthContextType";
import { AuthContextProviderType } from "../types/AuthContextProviderType";
import { createTheme } from "@mui/material";
import { CustomDarkTheme } from "../themes/Dark";
import { LightTheme } from "../themes/Light";
import useLogin from "../hooks/useLogin";

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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const clearMessage = () => {
    setMessage("");
  }

  const clearError = () => {
    setError("");
  }

  const handleCloseMessage = () => {
    clearMessage();
    setOpen(false);
  }

  const handleCloseError = () => {
    clearError();
    setOpen(false);
  }

  const light = createTheme(LightTheme);
  const dark = createTheme(CustomDarkTheme);

  const toggle_theme = () => {
    if (theme === "Light") {
      setTheme("Dark");
    } else {
      setTheme("Light");
    }
  };

  const currentTheme = theme === "Light" ? light : dark;

  const login = useLogin();
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("book");
    setCurrentUser(null);
    setBook(null)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("theme", JSON.stringify(theme));
    localStorage.setItem("book", JSON.stringify(book));
  }, [currentUser, theme, book]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTheme,
        logout,
        toggle_theme,
        message,
        error,
        setCurrentUser,
        setMessage,
        setError,
        loading,
        setLoading,
        login,
        book, 
        setBook,
        open,
        setOpen,
        clearError,
        clearMessage,
        handleCloseError,
        handleCloseMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
