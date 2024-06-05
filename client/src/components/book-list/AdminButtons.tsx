// MUI imports
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../hooks/useAppContext";

interface Props {
  openEditForm: () => void;
  openDeleteForm: () => void;
}

export default function AdminButtons({ openEditForm, openDeleteForm }: Props) {
  const appContext = useAppContext();
  const theme = appContext.currentTheme;
  return (
    <Box className="book-card-buttons">
      <Button
        title="Edit Button"
        variant="outlined"
        color={theme.palette.mode === "dark" ? "info" : "primary"}
        className="book-card-button"
        onClick={openEditForm}
      >
        Edit
      </Button>
      <Button
        title="Delete Button"
        variant="contained"
        color="error"
        className="book-card-button"
        onClick={openDeleteForm}
      >
        Delete
      </Button>
    </Box>
  );
}
