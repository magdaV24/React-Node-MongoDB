import { Container, Modal } from "@mui/material";
import EditBookPhotos from "./EditBookPhotos";
import EditBookTable from "./EditBookTable";

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
  handleClose: () => void;
  open: boolean;
  id: string;
  photos: string[];
  title: string;
  author: string;
  published: string;
  description: string;
  genres: string[];
  language: string;
  pages: number
}
export default function EditBookForm({
  open,
  handleClose,
  id,
  photos,
  title, author, published, genres, description, language, pages
}: Modal) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Container sx={style}>
      <EditBookPhotos
        _id={id}
        photos={photos}
      />
      <EditBookTable id={id} title={title} author={author} published={published} description={description} genres={genres} language={language} pages={pages} />
      </Container>
    </Modal>
  );
}
