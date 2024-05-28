import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { useAppContext } from "./hooks/useAppContext";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import ThemeButton from "./components/ThemeButton";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useToken } from "./hooks/useToken";
import BookPage from "./pages/BookPage";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundary as FallbackComponent } from "./components/error-handling/ErrorBoundary";
import useQueryHook from "./hooks/useQueryHook";
import { FETCH_BOOKS } from "./utils/urls";
import ErrorAlert from "./components/ErrorAlert";
import SuccessAlert from "./components/SuccessAlert";

function App() {
  const appContext = useAppContext();
  const token = appContext.token;
  const setToken=  appContext.setToken;
  const { checkToken, setTheToken, getUserId } = useToken(setToken);

  const [currentUserId, setCurrentUserId] = useState<string | null>("");
  
  const queryKey = "booksQuery";
  const { data } = useQueryHook(FETCH_BOOKS, queryKey);

  useEffect(() => {
    const fetchData = async () => {
      setTheToken();
      if (token) {
        checkToken(token);
        if(token){
          try {
            const id = await getUserId(token);
            setCurrentUserId(id);
          } catch (error) {
            console.log(error)
          }
        }
      }
    };
  
    fetchData();
  
  }, [appContext.token]);
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <ThemeProvider theme={appContext.currentTheme}>
      <CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage data={data} />} />
            <Route path="/:title" element={<BookPage id={currentUserId}/>} />
          </Routes>
        </BrowserRouter>
        <Navbar id={currentUserId}/>
        <ThemeButton handleToggleTheme={appContext.toggleTheme} />
        <ErrorAlert />
        <SuccessAlert/>
      </CssBaseline>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
