import {
  Modal,
  TextField,
  Button,
  CircularProgress,
  Container,
  styled,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { ModalInterface } from "../interfaces/ModalInterface";
import { useEffect, useState } from "react";
import { PRESET } from "../cloudinary/cloudinary";
import { wrapper } from "../styles/registerForm";
import { useAuthContext } from "../hooks/useAuthContext";
import useRegister from "../hooks/mutations/useRegistrationMutation";
import useCloudinary from "../hooks/mutations/useCloudinaryMutation";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Register({ open, handleClose }: ModalInterface) {
  const {
    control,
    getValues,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [disabled, setDisabled] = useState(false);
  const authContext = useAuthContext();
  const submit_to_cloudinary = useCloudinary();
  const { register, registerLoading } = useRegister();

  const onSubmit = async () => {
    setDisabled(true);
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
      setDisabled(false);
      reset()
    } catch (error) {
      console.log(`Error: ${error}`)
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
    } else if (authContext.error !== "") {
      authContext.setError(authContext.error);
      authContext.setOpenError(true);
    } else if (authContext.message !== "" && authContext.currentUser !== null) {
      authContext.setMessage(authContext.message);
      authContext.setOpenMessage(true);
    }  else {
      authContext.clearError();
      authContext.clearMessage();
    }
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload avatar
              <VisuallyHiddenInput
                type="file"
                onChange={(e) => field.onChange(e.target.files)}
              />
            </Button>
          )}
        />
        {registerLoading ? (
          <Button className="loading-button">
            <CircularProgress />
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={disabled}
            variant="outlined"
            size="large"
          >
            REGISTER
          </Button>
        )}
      </Container>
    </Modal>
  );
}