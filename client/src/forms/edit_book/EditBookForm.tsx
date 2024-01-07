import { Container, Modal } from "@mui/material";
import EditBookPhotos from "./EditBookPhotos";
import EditBookTable from "./EditBookTable";
import { Book } from "../../types/Book";

const style = {
    position: "absolute",
    top: "10%",
    left: '15%',
    width: '80%',
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    bgcolor: "secondary.light",
    boxShadow: 24,
    p: 4,
    borderRadius: "2px",
    height: '80vh', 
    overflowY: 'auto'
  };
interface Modal {
  open: boolean;
  handleClose: () => void
  book: Book
}
export default function EditBookForm({
  open,
  handleClose,
  book
  
}: Modal) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Container sx={style}>
      <EditBookPhotos
        _id={book?._id}
        photos={book?.photos}
      />
      <EditBookTable book={book} />
      </Container>
    </Modal>
  );
}
