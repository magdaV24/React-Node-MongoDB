import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import ErrorAlert from "../components/global/ErrorAlert";
import SuccessAlert from "../components/global/SuccessAlert";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import FaceSharpIcon from "@mui/icons-material/FaceSharp";
import { button_style, header_style, wrapper } from "../styles/loginForm";
import { ModalInterface } from "../interfaces/ModalInterface";
import useLogin from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Login({ open, handleClose }: ModalInterface) {
  const authContext = useAuthContext();

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm();

  const { message, error, disabled } = useContext(AuthContext);
  const {login, loginLoading} = useLogin();

  const handleLogin = async () => {
    authContext.setDisabled(true)
    const input = { ...getValues() };
    try {
      await login(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
    reset();
    authContext.setDisabled(false)
  };

  useEffect(() => {
    if (errors.email) authContext.setError(errors.email.message as string);
    if (errors.password)
      authContext.setError(errors.password.message as string);
  }, [authContext, errors.email, errors.password]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={wrapper} component="form">
        <Container sx={header_style}>
          <FaceSharpIcon color="primary" />
          <Typography variant="h6">Login</Typography>
        </Container>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email required!",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Provide a valid e-mail address!",
            },
          }}
          render={({ field }) => (
            <TextField
              id="email-standard-basic"
              label="Email"
              variant="outlined"
              autoFocus
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password required!" }}
          render={({ field }) => (
            <TextField
              id="password-standard-basic"
              label="Password"
              type="password"
              variant="outlined"
              autoFocus
              {...field}
            />
          )}
        />
        {loginLoading ? (
          <Button className='login-button' variant='contained'>
            <CircularProgress />
          </Button>
        ) : (
          <Button
            sx={button_style}
            type="submit"
            onClick={handleSubmit(handleLogin)}
            disabled={disabled}
          >
            LOGIN
          </Button>
        )}
        {message && <SuccessAlert />}
        {error && <ErrorAlert />}
      </Container>
    </Modal>
  );
}
