import { Container } from "@mui/material";
import Bar from "../../components/global/Bar";
import { books_container, wrapper } from "../../styles/adminPage"
import ModalButton from "./components/ModalButton";
import BookForm from "../../forms/BookForm";
import {  useState } from "react";
import { Book } from "../../types/Book";
import AdminBookCard from "../../components/book/AdminBookCard";
import useFetchBooks from "../../hooks/queries/useFetchBooks";

export default function AdminPage() {
    const [showForm, setShowForm] = useState(false);
    function closeForm() {
      setShowForm(false);
    }
    const {data} = useFetchBooks();
    
  return (
    <Container
      sx={wrapper}
    >
      <Bar />
      <Container
        sx={books_container}
      >
        {data &&
            (data as unknown as Book[]).map((book: Book) => (
              <AdminBookCard
                key={book._id}
                book={book}
              />
            ))}
      </Container>
      <BookForm open={showForm} handleClose={closeForm} />
      <ModalButton handleButton={() => setShowForm((prev) => !prev)} />

    </Container>
  );
}
