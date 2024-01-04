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
import { useContext, useEffect, useState } from "react";
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
  const [disabled, setDisabled] = useState(false)
  const authContext = useAuthContext();
  const { error, message } = useContext(AuthContext);
  const submit_to_cloudinary = useCloudinary();
  const {register, registerLoading} = useRegister();

  const onSubmit = async () => {
    setDisabled(true)
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
      setDisabled(false)
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  useEffect(() => {
    if (errors.email) {
      authContext.setError("Email error: " + errors.email.message);
    } else if (errors.password) {
      authContext.setError("Password error: " + errors.password.message);
    } else if (errors.username) {
      authContext.setError("Username error: " + errors.username.message);
    } else if (errors.avatar) {
      authContext.setError("Avatar error: " + errors.avatar.message);
    } else {
      authContext.clearError();
    }
  }, [authContext, errors.avatar, errors.email, errors.password, errors.username]);
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
            <Button variant="contained" disabled={disabled}>
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
        {registerLoading ? (
          <Box className="loading-button">
            <CircularProgress />
          </Box>
        ) : (
          <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={disabled} variant="outlined" size="large">
            REGISTER
          </Button>
        )}
        {message && <SuccessAlert />}
        {error && <ErrorAlert />}
      </Container>
    </Modal>
  );
}
