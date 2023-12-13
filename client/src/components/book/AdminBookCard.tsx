import { Button, Card, Container, Typography } from "@mui/material";
import { Book } from "../../../types/Book";
import BookImagesDisplay from "./BookImagesDisplay";
import BookTable from "./BookTable";
import { useMutation } from "react-query";
import postData from "../../../functions/postData";
import { DELETE_BOOK } from "../../../api/urls";
import EditBookForm from "../forms/EditBookForm";
import { useState } from "react";

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
  // Deleting a book

  const delete_mutation = useMutation((input: unknown) => deleteBook(input));

  const deleteBook = async (input: unknown) => {
    try {
      return await postData(DELETE_BOOK, input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  // Edit a book

  const [showForm, setShowForm] = useState(false);
  function closeForm() {
    setShowForm(false);
  }

  const submitDelete = () => {
    const data = {
      id: _id,
      photos: photos,
    };
    delete_mutation.mutate(data);
  };
  return (
    <Card
      sx={{
        width: "100%",
        mt: 10,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        p: 2,
        minHeight: "60vh",
        height: "fit-content",
      }}
    >
      <Container
        sx={{
          display: "flex",
          gap: 2,
          height: "3vh",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="info"
          sx={{ width: "10vw" }}
          variant="outlined"
          onClick={() => setShowForm((prev) => !prev)}
        >
          EDIT
        </Button>
        <Button
          color="warning"
          sx={{ width: "10vw" }}
          variant="outlined"
          onClick={submitDelete}
        >
          DELETE
        </Button>
      </Container>
      <Container
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Container
          sx={{
            width: "30%",
            height: "20vh",
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 3,
          width: "100",
        }}
      >
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
    </Card>
  );
}
