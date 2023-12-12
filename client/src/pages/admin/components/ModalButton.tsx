import { Fab } from "@mui/material";
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { fab_style } from "../../../styles/adminPage";
import { ModalButtonInterface } from "../../../interfaces/ModalButtonInterface";

export default function ModalButton({handleButton}: ModalButtonInterface){

    return (
        <Fab color="primary" variant="circular" sx={fab_style} onClick={handleButton}>
            <AddCircleOutlineSharpIcon sx={{fontSize: "2rem"}}/>
        </Fab>
    )
}