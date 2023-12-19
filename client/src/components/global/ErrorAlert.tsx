import { Alert, Snackbar } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";

export default function ErrorAlert() {
  const { openError, handleCloseError, error } = useContext(AuthContext);
  return (
    <Snackbar open={openError} onClose={handleCloseError}>
      <Alert severity="error">{error}</Alert>
    </Snackbar>
  );
}
