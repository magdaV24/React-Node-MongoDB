import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { useAppContext } from "../hooks/useAppContext";

export default function SuccessAlert() {
  const appContext = useAppContext();
  const success = appContext.success;
  const open = appContext.openSuccessAlert;
  const handleClose = () => {
    appContext.handleCloseSuccessAlert();
    appContext.clearSuccessMessage();
  };

  return (
    <Modal className="modal" open={open} onClose={handleClose}>
      <Box sx={{ backgroundColor: "success.dark" }} className="alert-wrapper">
        <Typography variant="h5">It went smoothly!</Typography>
        <Divider className="divider" />
        <Typography>{success}</Typography>
        <Divider className="divider" />
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </Box>
    </Modal>
  );
}
