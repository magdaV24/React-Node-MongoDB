import { Modal, Typography } from "@mui/material";
import { useAppContext } from "../hooks/useAppContext";

export default function SuccessAlert() {
    const appContext = useAppContext();
    const success = appContext.success;
    const open = appContext.openSuccessAlert;
    const handleClose =  () =>{
        appContext.setOpenSuccessAlert(false);
    }

    return(
        <Modal className="modal" open={open} onClose={handleClose}>
            <Typography>{success}</Typography>
        </Modal>
    )
}
