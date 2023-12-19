import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
} from "@mui/material";
import BookImagesDisplay from "./BookImagesDisplay";
import BookTable from "./BookTable";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import useDeleteBook from "../../hooks/useDeleteBook";
import ErrorAlert from "../global/ErrorAlert";
import SuccessAlert from "../global/SuccessAlert";
import EditBookForm from "../../forms/edit_book/EditBookForm";
import { Book } from "../../types/Book";
import {
  buttons_wrapper,
  card_wrapper,
  container_wrapper,
  table_wrapper,
} from "../../styles/adminBookCard";

export default function AdminBookCard({
  _id,
  author,
  title,
  description,
  language,
  genres,
  photos,
  pages,
  published,
}: Book) {
  const { error, message, loading } = useContext(AuthContext);

  // Deleting a book

  const delete_book = useDeleteBook();
  const submitDelete = async () => {
    const data = {
      id: _id,
      photos: photos,
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
        {loading ? (
          <Box>
            <CircularProgress />
          </Box>
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
          author={author}
          title={title}
          description={description}
          language={language}
          genres={genres}
          pages={pages}
          published={published}
        />
      </Container>
      <EditBookForm
        handleClose={closeForm}
        open={showForm}
        id={_id}
        photos={photos}
        title={title}
        author={author}
        published={published}
        description={description}
        genres={genres}
        language={language}
        pages={pages}
      />
      
      <Container sx={container_wrapper}>
        <BookImagesDisplay
          photos={photos}
        />
      </Container>
      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Card>
  );
}
