import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useAppContext } from "../hooks/useAppContext";
import { LOGIN } from "../utils/urls";
import { useToken } from "../hooks/useToken";
import useMutationHook from "../hooks/useMutationHook";

export default function Login() {
  const appContext = useAppContext();
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm();

  const {postData, loading} = useMutationHook(LOGIN);
  const setToken = appContext.setToken
  const { saveToken} = useToken(setToken);
  const handleLogin = async () => {
    const input = { ...getValues() };
    try {
      await postData(input).then((res)=>{
        saveToken(res)
      });
      window.location.reload(); 
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
    reset();
  };

  useEffect(() => {
    if (errors.username)
      appContext.setError(`Email error: ${errors.username.message}`);
    else if (errors.password)
      appContext.setError(`Error: ${errors.password.message}`);
    else if (appContext.error !== "") {
      appContext.setError(appContext.error);
      appContext.setOpenErrorAlert(true);
    } else if (appContext.success !== "") {
      appContext.setSuccess(appContext.success);
      appContext.setOpenSuccessAlert(true);
    } else {
      appContext.clearErrorMessage();
      appContext.clearSuccessMessage();
    }
  }, [appContext, errors.password, errors.username]);

  return (
      <Card component="form" className="form-wrapper">
        <Box className="form-header" title='Login Form'>
          <FaceSharpIcon className="icon" color="primary" />
          <Typography variant="h4">Login</Typography>
        </Box>
        <Controller
          name="username"
          defaultValue=""
          control={control}
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
          <Button
            className="login-button"
            variant="contained"
            disabled
          >
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