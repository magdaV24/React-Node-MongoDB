import { Alert } from "@mui/material";

interface Props{
    message: string;
}
export default function InfoAlert ({message}: Props){
    return (
        <Alert severity='info'>{message}</Alert>
    )
}