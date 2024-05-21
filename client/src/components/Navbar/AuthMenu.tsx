import { Box, Button } from "@mui/material";

interface Props{
    showLogin: ()=>void,
    showRegister: ()=>void,
}
export default function AuthMenu({showLogin, showRegister}:Props) {
  return (
    <Box className="navbar-auth-menu-wrapper">
      <Button variant="outlined" className="app-bar-btn" onClick={showLogin}>
        Login
      </Button>
      <Button variant="outlined" className="app-bar-btn" onClick={showRegister}>
        Register
      </Button>
    </Box>
  );
}
