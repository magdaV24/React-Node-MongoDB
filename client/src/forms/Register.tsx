import {
  TextField,
  Button,
  CircularProgress,
  Card,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useCloudinary from "../hooks/useCloudinary";
import { FOLDER_NAME, PRESET } from "../utils/cloudinary";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PasswordPattern from "../components/PasswordPattern";
import { useAppContext } from "../hooks/useAppContext";
import useMutationHook from "../hooks/useMutationHook";
import { REGISTER } from "../utils/urls";
import { VisuallyHiddenInput } from "../utils/VisuallyHiddenInput";

export default function Register() {
  const {
    control,
    getValues,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!.@#$%^&*]{8,}$/;

  const appContext = useAppContext();
  const { postData, loading } = useMutationHook(REGISTER);

  const submitToCloudinary = useCloudinary();

  const onSubmit = async () => {
    const temp = getValues("avatar");
    if (!temp) {
      return console.log("Undefined avatar");
    }
    const formData = new FormData();

    formData.append("file", temp[0]);
    formData.append("upload_preset", PRESET);
    formData.append("folder", FOLDER_NAME);

    try {
      const id = await submitToCloudinary(formData);

      const input = {
        email: getValues("email"),
        username: getValues("username"),
        password: getValues("password"),
        avatar: id,
      };
      await postData(input);
      reset();
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (errors.email) {
      appContext.setError("Email error: " + errors.email.message);
      appContext.setOpenErrorAlert(true);
    } else if (errors.password) {
      appContext.setError("Password error: " + errors.password.message);
      appContext.setOpenErrorAlert(true);
    } else if (errors.username) {
      appContext.setOpenErrorAlert(true);
      appContext.setError("Username error: " + errors.username.message);
    } else if (errors.avatar) {
      appContext.setOpenErrorAlert(true);
      appContext.setError("Avatar error: " + errors.avatar.message);
    } else if (appContext.success !== "") {
      appContext.setSuccess(appContext.success);
      appContext.setOpenSuccessAlert(true);
    } else if (appContext.error !== "") {
      appContext.setError(appContext.error);
      appContext.setOpenErrorAlert(true);
    } else {
      appContext.clearErrorMessage();
      appContext.clearSuccessMessage();
    }
  }, [
    appContext,
    errors.avatar,
    errors.email,
    errors.password,
    errors.username,
  ]);
  return (
    <Card className="form-wrapper">
      <Box className="form-header"  title='Register Form'>
        <HowToRegIcon color="primary" />
        <Typography variant="h4">Register</Typography>
      </Box>
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
      <Box sx={{ display: "flex", gap: 2 }}>
        <Controller
          name="password"
          defaultValue=""
          control={control}
          rules={{
            required: "Password required!",
            pattern: {
              value: passwordRegex,
              message:
                "Password must contain at least one uppercase letter, one number, and one special character (! . @ # $ % ^ & *).",
            },
          }}
          render={({ field }) => (
            <TextField
              id="password-standard-basic"
              label="Password"
              type="password"
              variant="outlined"
              autoFocus
              fullWidth
              {...field}
            />
          )}
        />
        <PasswordPattern />
      </Box>
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
      {loading ? (
        <Button className="loading-button" disabled>
          <CircularProgress />
        </Button>
      ) : (
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="secondary"
          size="large"
        >
          REGISTER
        </Button>
      )}
    </Card>
  );
}
