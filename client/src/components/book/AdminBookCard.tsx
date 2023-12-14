import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Typography,
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
  card_header,
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
      <Container sx={container_wrapper}>
        <Container sx={card_header}>
          <Typography
            variant="h5"
            sx={{ width: "100%", fontSize: "1.5rem", marginBottom: 1 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ width: "100%", fontSize: "1.5rem", marginBottom: 1 }}
          >
            {author}
          </Typography>
        </Container>
        <BookImagesDisplay
          photos={photos}
          _id={""}
          author={""}
          title={""}
          description={""}
          language={""}
          genres={[]}
          reviews={[]}
          pages={pages}
          grade={[]}
          published={""}
        />
      </Container>
      <Container sx={table_wrapper}>
        <BookTable
          _id={_id}
          author={""}
          title={""}
          description={""}
          language={language}
          genres={genres}
          photos={[]}
          reviews={[]}
          pages={pages}
          grade={[]}
          published={published}
        />
        <Typography sx={{ width: "60%", height: "60vh" }}>
          {description}
        </Typography>
      </Container>
      <EditBookForm
        handleClose={closeForm}
        open={showForm}
        _id={_id}
        photos={photos}
        title={title}
        author={author}
        published={published}
        description={description}
        genres={genres}
        language={language}
        pages={pages}
      />
      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Card>
  );
}
