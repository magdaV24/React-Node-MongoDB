import { Alert } from "@mui/material";

interface Props{
    message: string;
}
export default function SuccessAlert ({message}: Props){
    return (
        <Alert severity='success'>{message}</Alert>
    )
}