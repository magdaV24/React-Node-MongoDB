import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContextProvider";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThemeButton from "./components/global/ThemeButton";
import Welcome from "./pages/welcome/Welcome";
import AdminPage from "./pages/admin/AdminPage";
import Home from "./pages/home/Home";
import BookPage from "./pages/book/BookPage";
import Backdrop from "./components/global/Backdrop";
import ErrorAlert from "./components/global/ErrorAlert";
import SuccessAlert from "./components/global/SuccessAlert";
import { useCheckToken } from "./hooks/useCheckToken";

function App() {
  const { currentTheme, toggle_theme } = useContext(AuthContext);
  const checkToken = useCheckToken();

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/:title" element={<BookPage />} />
          </Routes>
        </BrowserRouter>
        <ThemeButton handleToggleTheme={toggle_theme} />
        <Backdrop />
        <ErrorAlert />
        <SuccessAlert />
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
