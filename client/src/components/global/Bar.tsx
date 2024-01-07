import AppBar from "@mui/material/AppBar";
import { Box, Button, Container, Tooltip, alpha, styled } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import MoreIcon from "@mui/icons-material/MoreVert";
import ImportContactsSharpIcon from "@mui/icons-material/ImportContactsSharp";
import AdminPanelSettingsSharpIcon from "@mui/icons-material/AdminPanelSettingsSharp";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import InputBase from "@mui/material/InputBase";
import { Controller, useForm } from "react-hook-form";
import { useContext, useState } from "react";
import SearchResult from "./SearchResult";
import _debounce from "lodash/debounce";
import Register from "../../forms/Register";
import Login from "../../forms/Login";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import { AuthContext } from "../../context/AuthContextProvider";
import { Book } from "../../types/Book";
import { SEARCH } from "../../api/urls";
import Drawer from "../user/Drawer";
import useFetchData from "../../hooks/useFetchData";

export default function Bar() {
  const { currentUser, logout } = useContext(AuthContext);
  const cld = cloudinaryFnc();

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  function closeLogin() {
    setOpenLogin(false);
  }
  function closeRegister() {
    setOpenRegister(false);
  }

  // Search bar

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "60vw",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  // Search function
  const fetchData = useFetchData();
  const searchQuery = (input: string) => fetchData(`${SEARCH}/${input}`);
  const [searchResult, setSearchResult] = useState([]);

  const { control } = useForm();
  const search_function = (input: string) => {
    if (input === "") setSearchResult([]);
    searchQuery(input).then((res) => setSearchResult(res));
  };
  const debounced_search_function = _debounce(search_function, 550);
  return (
    <Container>
      <AppBar position="fixed" sx={{ padding: 0.25 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            sx={{ mr: 2 }}
            href="/home"
          >
            <ImportContactsSharpIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ width: "40vw" }}
            color="secondary"
          >
            NOVEL NOTES
          </Typography>
          <Container sx={{ display: "flex", flexDirection: "column" }}>
            <Search>
              <SearchIconWrapper>
                <SearchSharpIcon />
              </SearchIconWrapper>
              <Controller
                control={control}
                name="search"
                render={({ field }) => (
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    {...field}
                    onChange={(e: { target: { value: string } }) => {
                      field.onChange(e);
                      debounced_search_function(e.target.value);
                    }}
                  />
                )}
              />
            </Search>
            <Container
              sx={{
                position: "absolute",
                width: "25vw",
                mt: 5,
                ml: 7,
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              {searchResult &&
                searchResult.map((res: Book) => (
                  <SearchResult
                    title={res.title}
                    author={res.author}
                    photo={res.photos}
                  />
                ))}
            </Container>
          </Container>
          <Container sx={{ flexGrow: 1 }} />
          <Container
            sx={{
              display: { xs: "none", md: "flex" },
              width: "20vw",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Container
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                alignContent: "center",
                height: "100%",
                width: "fit-content",
                padding: 0.2,
              }}
            >
              {currentUser && (
                <Box onClick={handleOpenDrawer}>
                  <AdvancedImage
                  cldImg={cld
                    .image(currentUser.avatar)
                    .resize(fill().width(50).height(50))}
                />
                </Box>
              )}
            </Container>
            {currentUser && (
              <>
                {currentUser.role === "Admin" && (
                  <>
                    <Tooltip title="Admin Page">
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                        href="/admin"
                      >
                        <AdminPanelSettingsSharpIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </>
            )}
            {currentUser && (
              <Tooltip title="Logout">
                <IconButton onClick={logout} color="error">
                  <LogoutSharpIcon />
                </IconButton>
              </Tooltip>
            )}

            {!currentUser && (
              <>
                <Button
                  color="secondary"
                  size="medium"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => setOpenLogin(true)}
                >
                  LOGIN
                </Button>
                <Button
                  color="secondary"
                  size="medium"
                  variant="outlined"
                  onClick={() => setOpenRegister(true)}
                >
                  REGISTER
                </Button>
              </>
            )}
          </Container>
          <Container sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>
      <Login open={openLogin} handleClose={closeLogin} />
      <Register open={openRegister} handleClose={closeRegister} />
      {currentUser && <Drawer isOpen={openDrawer} handleClose={handleCloseDrawer} handleOpen={handleOpenDrawer} />}
    </Container>
  );
}
