import { Alert, Snackbar } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";

export default function SuccessAlert (){

    const { open, handleCloseMessage, message } = useContext(AuthContext)
    return (
        <Snackbar open={open} onClose={handleCloseMessage}>
            <Alert severity='success'>{message}</Alert>
        </Snackbar>
    )
}