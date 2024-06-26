//  React imports
import { useState, SetStateAction } from "react";

// MUI imports
import { Box, AppBar, Toolbar, Modal } from "@mui/material";

// Context management
import { useAppContext } from "../../hooks/useAppContext";

// Styles
import "../../styles/components/navbar.css";

// Custom forms
import Register from "../../forms/Register";
import Login from "../../forms/Login";

// Custom hooks
import useGetUser from "../../hooks/useGetUser";
import { useToken } from "../../hooks/useToken";
import useSearchBooks from "../../hooks/useSearchBooks";
import useQueryWithToken from "../../hooks/useQueryWithToken";

// Utils
import { FETCH_DRAWER_BOOKS, SEARCH } from "../../utils/urls";

// Custom components
import Drawer from "../Drawer";
import AppName from "./AppName";
import UserMenu from "./UserMenu";
import AuthMenu from "./AuthMenu";
import SearchBar from "./SearchBar";
import AddBook from "../../forms/AddBook";


interface Props {
  id: string | null;
}

export default function Navbar({ id }: Props) {
  const appContext = useAppContext();
  const [openMenu, setOpenMenu] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openBookForm, setOpenBookForm] = useState(false);

  function showRegister() {
    setOpenRegister(true);
  }

  function showLogin() {
    setOpenLogin(true);
  }
  const enabled = appContext.isAuthenticated

  const user = useGetUser(id, enabled);

  const token = appContext.token;
  const setAuth = appContext.setIsAuthenticated
  const setToken = appContext.setToken;
  const { logout } = useToken(setToken, setAuth);

  // User menu

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event: { currentTarget: SetStateAction<null> }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Search functionality
  const {
    searchInput,
    searchResult,
    searchFunction,
    setSearchInput,
    openSearchResult,
    setOpenSearchResult,
    handleCloseSearchResult,
  } = useSearchBooks(SEARCH);

  // Fetching the books for the Drawer:
  const userId = user?._id;
  const queryOne = `currentlyReading/${userId}`;
  const queryTwo = `antToRead/${userId}`;
  const queryThree = `read/${userId}`;

  const urlOne = `${FETCH_DRAWER_BOOKS}/${userId}/currentlyReading`;
  const urlTwo = `${FETCH_DRAWER_BOOKS}/${userId}/wantToRead`;
  const urlThree = `${FETCH_DRAWER_BOOKS}/${userId}/read`;
  const { data: currentlyReading } = useQueryWithToken(urlOne, queryOne, !!userId);
  const { data: wantToRead } = useQueryWithToken(urlTwo, queryTwo, !!userId);
  const { data: read } = useQueryWithToken(urlThree, queryThree, !!userId);

// Logout

const handleLogout=()=>{
  logout(token)
  appContext.setIsAuthenticated(false)
}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{backgroundColor: 'background.paper'}}>
        <Toolbar className="bar-wrapper">
          <AppName />
          <SearchBar
            openSearchResult={openSearchResult}
            searchInput={searchInput}
            searchResult={searchResult}
            searchFunction={searchFunction}
            setSearchInput={setSearchInput}
            handleCloseSearchResult={handleCloseSearchResult}
            setOpenSearchResult={setOpenSearchResult}
          />
          {user ? (
            <>
              <UserMenu
                user={user}
                handleOpenMenu={handleOpenMenu}
                handleCloseMenu={handleCloseMenu}
                setOpenMenu={setOpenMenu}
                setOpenBookForm={setOpenBookForm}
                anchorEl={anchorEl}
                logout={handleLogout}
              />
            </>
          ) : (
            <>
              <AuthMenu showLogin={showLogin} showRegister={showRegister} />
            </>
          )}
        </Toolbar>
      </AppBar>

      <Modal
        open={openRegister}
        className="modal"
        onClose={() => setOpenRegister(false)}
      >
        <div>
          <Register />
        </div>
      </Modal>

      <Modal
        open={openLogin}
        className="modal"
        onClose={() => setOpenLogin(false)}
      >
        <div>
          <Login />
        </div>
      </Modal>

      <Modal
        open={openBookForm}
        className="modal"
        onClose={() => setOpenBookForm(false)}
      >
        <div>
          <AddBook />
        </div>
      </Modal>

      {user && (
        <Drawer
          isOpen={openMenu}
          handleClose={() => setOpenMenu(false)}
          handleOpen={() => setOpenMenu(true)}
          userId={user?._id}
          read={read}
          currentlyReading={currentlyReading}
          wantToRead={wantToRead}
        />
      )}
    </Box>
  );
}
