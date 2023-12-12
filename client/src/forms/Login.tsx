import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import ErrorAlert from "../components/global/ErrorAlert";
import SuccessAlert from "../components/global/SuccessAlert";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import FaceSharpIcon from "@mui/icons-material/FaceSharp";
import { button_style, header_style, wrapper } from "../styles/loginForm";
import { ModalInterface } from "../interfaces/ModalInterface";
import useLogin from "../hooks/useLogin";

export default function Login({ open, handleClose }: ModalInterface) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm();

  const {  message, loading, error } = useContext(AuthContext);
  const login = useLogin()

  const handleLogin = () => {
    const input = { ...getValues() };
    try {
      login(input)
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
    reset()
  };

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container sx={wrapper} component="form">
          <Container
            sx={header_style}
          >
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
          {errors.email && (
            <ErrorAlert message={errors.email.message as string} />
          )}
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
          {errors.password && (
            <ErrorAlert message={errors.password.message as string} />
          )}
          {loading ? (
            <Box sx={button_style}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              sx={button_style}
              type="submit"
              onClick={handleSubmit(handleLogin)}
            >
              LOGIN
            </Button>
          )}
          {message && <SuccessAlert message={message} />}
          {error && <ErrorAlert message={error} />}
        </Container>
      </Modal>
  );
}
