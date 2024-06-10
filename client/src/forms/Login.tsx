// React imports
import { useEffect } from "react";

// React Hook Form import
import { Controller, useForm } from "react-hook-form";

// MUI imports
import {
  Typography,
  TextField,
  CircularProgress,
  Button,
  Box,
  Card,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FaceSharpIcon from "@mui/icons-material/FaceSharp";

// Context management
import { useAppContext } from "../hooks/useAppContext";

// Utils
import { LOGIN } from "../utils/urls";

//Custom hooks
import { useToken } from "../hooks/useToken";
import useMutationHook from "../hooks/useMutationHook";

// import bcrypt from 'bcryptjs'

export default function Login() {
  const appContext = useAppContext();
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm();

  const { postData, loading } = useMutationHook(LOGIN);
  const setToken = appContext.setToken;
  const setAuth = appContext.setIsAuthenticated;
  const { saveToken } = useToken(setToken, setAuth);

  const handleLogin = async () => {
    try {
      // const password = getValues("password");
      // const hashedPassword = (await bcrypt.hash(password, 12)).toString();
      const input = { ...getValues() };
      await postData(input).then((res) => {
        saveToken(res);
      });
      appContext.setSuccess("Successful login!");
      appContext.setOpenSuccessAlert(true);
      setAuth(true);
      reset();
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (errors.username) {
      appContext.setError(`Username error: ${errors.username.message}`);
      appContext.setOpenErrorAlert(true);
    } else if (errors.password) {
      appContext.setError(`Password error: ${errors.password.message}`);
      appContext.setOpenErrorAlert(true);
    } else {
      appContext.clearErrorMessage();
    }
  }, [appContext, errors.password, errors.username]);

  return (
    <Card component="form" className="form-wrapper">
      <Box className="form-header" title="Login Form">
        <FaceSharpIcon
          className="icon"
          color="primary"
          sx={{ fontSize: "2rem" }}
        />
        <Typography variant="h4">Login</Typography>
      </Box>
      <Controller
        name="username"
        defaultValue=""
        control={control}
        rules={{ required: "Username required!" }}
        render={({ field }) => (
          <TextField
            id="username-standard-basic-login"
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
        defaultValue=""
        render={({ field }) => (
          <TextField
            id="password-standard-basic-login"
            label="Password"
            type="password"
            variant="outlined"
            autoFocus
            {...field}
          />
        )}
      />
      <Controller
        name="rememberMe"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            label="Remember me"
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        )}
      />

      {loading ? (
        <Button className="login-button" variant="contained" disabled>
          <CircularProgress />
        </Button>
      ) : (
        <Button
          type="submit"
          onClick={handleSubmit(handleLogin)}
          variant="contained"
        >
          LOGIN
        </Button>
      )}
    </Card>
  );
}
