import { Button, Container } from "@mui/material";
import Login from "../../forms/Login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buttons_wrapper, large_button, small_button, wrapper } from "../../styles/welcomePage";
import Register from "../../forms/Register";

export default function Welcome() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/home");
  };

  const [showLogin, setShowLogin] = useState(false);
  function closeLogin() {
    setShowLogin(false);
  }

  const [showRegister, setShowRegister] = useState(false);
  function closeRegister() {
    setShowRegister(false);
  }

  return (
    <Container sx={wrapper}>
      <Container sx={buttons_wrapper}>
        <Button
          variant="outlined"
          onClick={() => setShowLogin(true)}
          sx={small_button}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          sx={small_button}
          onClick={() => setShowRegister(true)}
        >
          Register
        </Button>
      </Container>
      <Button variant="outlined" onClick={handleClick} sx={large_button}>
        Go to the dashboard
      </Button>
      <Login open={showLogin} handleClose={closeLogin} />
      <Register open={showRegister} handleClose={closeRegister} />
    </Container>
  );
}
