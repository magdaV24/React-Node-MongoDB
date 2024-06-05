// React and React-Router-Dom imports
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

// MUI imports
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";

// Context Management
import { useAppContext } from "./hooks/useAppContext";

// Error Boundary
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundary as FallbackComponent } from "./components/error-handling/ErrorBoundary";

// Custom Hooks
import { useToken } from "./hooks/useToken";

// Pages
import BookPage from "./pages/BookPage";
import HomePage from "./pages/HomePage";

// Custom Components
import ErrorAlert from "./components/ErrorAlert";
import SuccessAlert from "./components/SuccessAlert";
import ThemeButton from "./components/ThemeButton";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const appContext = useAppContext();
  const token = appContext.token;
  const setToken = appContext.setToken;
  const setAuth = appContext.setIsAuthenticated
  const { checkToken, setTheToken, getUserId } = useToken(setToken, setAuth);

  const [currentUserId, setCurrentUserId] = useState<string | null>("");

  useEffect(() => {
    const fetchData = async () => {
      setTheToken();
      if (token) {
        checkToken(token);
        if (token) {
          try {
            const id = await getUserId(token);
            setCurrentUserId(id);
          } catch (error) {
            appContext.setError(`${error}`);
            appContext.setOpenErrorAlert(true)
          }
        }
      }
    };

    fetchData();
  }, [token, appContext, setTheToken, checkToken, getUserId]);
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <ThemeProvider theme={appContext.currentTheme}>
        <CssBaseline>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:title" element={<BookPage id={currentUserId} />} />
            </Routes>
          </BrowserRouter>
          <Navbar id={currentUserId} />
          <ThemeButton handleToggleTheme={appContext.toggleTheme} />
          <ErrorAlert />
          <SuccessAlert />
        </CssBaseline>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
