import { Modal, Typography } from "@mui/material";
import { useAppContext } from "../hooks/useAppContext";

export default function ErrorAlert() {
    const appContext = useAppContext();
    const error = appContext.error;
    const open = appContext.openErrorAlert;
    const handleClose =  () =>{
        appContext.setOpenErrorAlert(false);
    }

    return(
        <Modal className="modal" open={open} onClose={handleClose}>
            <Typography>{error}</Typography>
        </Modal>
    )
}
