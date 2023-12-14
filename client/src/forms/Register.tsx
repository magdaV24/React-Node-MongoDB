import {
  Modal,
  TextField,
  Button,
  Box,
  CircularProgress,
  Container,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ErrorAlert from "../components/global/ErrorAlert";
import { ModalInterface } from "../interfaces/ModalInterface";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import SuccessAlert from "../components/global/SuccessAlert";
import { PRESET } from "../cloudinary/cloudinary";
import useCloudinary from "../hooks/useCloudinary";
import useRegister from "../hooks/useRegister";
import { wrapper } from "../styles/registerForm";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Register({ open, handleClose }: ModalInterface) {
  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const authContext = useAuthContext();
  const { error, message, loading } = useContext(AuthContext);
  const submit_to_cloudinary = useCloudinary();
  const register = useRegister();

  const onSubmit = async () => {
    const temp = getValues("avatar");
    if (temp === undefined) {
      return console.log("Undefined avatar");
    }
    const formData = new FormData();

    formData.append("file", temp[0]);
    formData.append("upload_preset", PRESET);
    try {
      const id = await submit_to_cloudinary(formData);

      const input = {
        email: getValues("email"),
        username: getValues("username"),
        password: getValues("password"),
        avatar: id,
      };
      await register(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  useEffect(() => {
    if (errors.email) authContext.setError(errors.email.message as string);
    if (errors.password)
      authContext.setError(errors.password.message as string);
    if (errors.username)
      authContext.setError(errors.username.message as string);
    if (errors.avatar) authContext.setError(errors.avatar.message as string);
  }, [
    authContext,
    errors.avatar,
    errors.email,
    errors.password,
    errors.username,
  ]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={wrapper}>
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
          name="username"
          control={control}
          rules={{ required: "Username required!" }}
          render={({ field }) => (
            <TextField
              id="username-standard-basic"
              label="Username"
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
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm you password!",
            validate: (password) =>
              password === getValues("password") ||
              "The two passwords do not match!",
          }}
          render={({ field }) => (
            <TextField
              id="confirm-password-standard-basic"
              label="Confirm Password"
              type="password"
              variant="outlined"
              autoFocus
              {...field}
            />
          )}
        />
        <Controller
          name="avatar"
          control={control}
          rules={{ required: "Avatar required!" }}
          render={({ field }) => (
            <Button variant="contained">
              Upload an avatar
              <input
                id="avatar-standard-basic"
                type="file"
                onChange={(e) => field.onChange(e.target.files)}
                // style={{display: 'none'}}
              />
            </Button>
          )}
        />
        {loading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            REGISTER
          </Button>
        )}
        {message && <SuccessAlert />}
        {error && <ErrorAlert />}
      </Container>
    </Modal>
  );
}
