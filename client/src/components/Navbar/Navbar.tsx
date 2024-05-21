import { Box, AppBar, Toolbar, Modal } from "@mui/material";
import "../../styles/components/navbar.css";
import { SetStateAction, useState } from "react";
import Register from "../../forms/Register";
import Login from "../../forms/Login";
import useGetUser from "../../hooks/useGetUser";
import { useToken } from "../../hooks/useToken";
import Drawer from "../Drawer";
import { FETCH_DRAWER_BOOKS, SEARCH } from "../../utils/urls";
import AppName from "./AppName";
import UserMenu from "./UserMenu";
import AuthMenu from "./AuthMenu";
import SearchBar from "./SearchBar";
import useSearchBooks from "../../hooks/useSearchBooks";
import AddBook from "../../forms/AddBook";
import useQueryHook from "../../hooks/useQueryHook";
import { useAppContext } from "../../hooks/useAppContext";

interface Id {
  id: string | null;
}

export default function Navbar({ id }: Id) {
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

  const user = useGetUser(id);
  const token = appContext.token;
  const setToken = appContext.setToken;
  const { logout } = useToken(setToken);

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
  const { data: currentlyReading } = useQueryHook(urlOne, queryOne);
  const { data: wantToRead } = useQueryHook(urlTwo, queryTwo);
  const { data: read } = useQueryHook(urlThree, queryThree);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
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
                logout={()=>logout(token)}
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
