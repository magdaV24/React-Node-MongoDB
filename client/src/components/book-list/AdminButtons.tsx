import { Box, Button } from "@mui/material";

interface Props{
    openEditForm: ()=>void;
    openDeleteForm:()=>void;
}

export default function AdminButtons({openEditForm, openDeleteForm}:Props) {
    return(
        <Box className="book-card-buttons">
        <Button
          variant="outlined"
          color="info"
          className="book-card-button"
          onClick={openEditForm}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          className="book-card-button"
          onClick={openDeleteForm}
        >
          Delete
        </Button>
      </Box>
    )
}
