import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { useAppContext } from "../hooks/useAppContext";

export default function ErrorAlert() {
  const appContext = useAppContext();
  const error = appContext.error;
  const open = appContext.openErrorAlert;
  const handleClose = () => {
    appContext.clearErrorMessage();
    appContext.handleCloseErrorAlert();
  };

  return (
    <Modal className="modal" open={open} onClose={handleClose}>
      <Box sx={{ backgroundColor: "error.dark" }} className="alert-wrapper">
        <Typography variant="h5">Something went wrong!</Typography>
        <Divider className="divider"/>
        <Typography>{error}</Typography>
        <Divider className="divider"/>
        <Button onClick={handleClose} variant="outlined">Close</Button>
      </Box>
    </Modal>
  );
}
