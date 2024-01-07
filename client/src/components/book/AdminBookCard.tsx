import {
  Button,
  Card,
  CircularProgress,
  Container,
} from "@mui/material";
import BookImagesDisplay from "./BookImagesDisplay";
import BookTable from "./BookTable";
import { useState } from "react";
import EditBookForm from "../../forms/edit_book/EditBookForm";
import { Book } from "../../types/Book";
import {
  buttons_wrapper,
  card_wrapper,
  container_wrapper,
  table_wrapper,
} from "../../styles/adminBookCard";
import useDeleteBook from "../../hooks/mutations/useDeleteBookMutation";
interface Props{
  book : Book;
}
export default function AdminBookCard({
book
}: Props) {

  // Deleting a book

  const {delete_book, deleteBookLoading} = useDeleteBook();
  const submitDelete = async () => {
    const data = {
      id: book?._id,
      photos: book?.photos,
    };
    try {
      await delete_book(data);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  // Edit a book

  const [showForm, setShowForm] = useState(false);
  function closeForm() {
    setShowForm(false);
  }

  return (
    <Card sx={card_wrapper}>
      <Container sx={buttons_wrapper}>
        <Button
          color="info"
          sx={{ width: "10vw" }}
          variant="outlined"
          onClick={() => setShowForm((prev) => !prev)}
        >
          EDIT
        </Button>
        {deleteBookLoading? (
          <Button>
            <CircularProgress />
          </Button>
        ) : (
          <Button
            color="warning"
            sx={{ width: "10vw" }}
            variant="outlined"
            onClick={submitDelete}
          >
            DELETE
          </Button>
        )}
      </Container>
      <Container sx={table_wrapper}>
        <BookTable
          book={book}
        />
      </Container>
      <EditBookForm
        handleClose={closeForm}
        open={showForm}
        book={book}
      />
      
      <Container sx={container_wrapper}>
        <BookImagesDisplay
          photos={book?.photos}
        />
      </Container>
    </Card>
  );
}
