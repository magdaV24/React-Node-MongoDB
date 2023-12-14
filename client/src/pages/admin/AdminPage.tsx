import { Container } from "@mui/material";
import Bar from "../../components/global/Bar";
import { books_container, wrapper } from "../../styles/adminPage"
import ModalButton from "./components/ModalButton";
import BookForm from "../../forms/BookForm";
import { useContext, useState } from "react";
import { useFetchBooks } from "../../hooks/queries/useFetchBooks";
import { Book } from "../../types/Book";
import AdminBookCard from "../../components/book/AdminBookCard";
import { AuthContext } from "../../context/AuthContextProvider";
import SuccessAlert from "../../components/global/SuccessAlert";
import ErrorAlert from "../../components/global/ErrorAlert";

export default function AdminPage() {
    const [showForm, setShowForm] = useState(false);
    function closeForm() {
      setShowForm(false);
    }

    const {message, error } = useContext(AuthContext)
    const {data} = useFetchBooks()
    
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
                _id={book._id}
                author={book.author}
                title={book.title}
                description={book.description}
                language={book.language}
                genres={book.genres}
                photos={book.photos}
                reviews={[]}
                pages={book.pages}
                grade={[]}
                published={book.published}
              />
            ))}
      </Container>
      <BookForm open={showForm} handleClose={closeForm} />
      <ModalButton handleButton={() => setShowForm((prev) => !prev)} />
      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Container>
  );
}
