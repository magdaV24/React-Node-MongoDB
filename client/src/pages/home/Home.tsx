import { useContext } from "react";
import { useFetchBooks } from "../../hooks/queries/useFetchBooks";
import { AuthContext } from "../../context/AuthContextProvider";
import { Container, CircularProgress } from "@mui/material";
import Bar from "../../components/global/Bar";
import { Book } from "../../types/Book";
import ErrorAlert from "../../components/global/ErrorAlert";
import BookThumbnail from "./components/BookThumbnail";
import { grid, home_wrapper } from "../../styles/homePage";

export default function Home() {
  const { data: books, error: booksError } = useFetchBooks();
  const { error, loading } = useContext(AuthContext);

  return (
    <Container sx={home_wrapper}>
      {/* <Bar /> */}
      <Container sx={grid}>
        {books &&
          books.map((book: Book) => (
            <BookThumbnail
              image={book.photos[0]}
              title={book.title}
              author={book.author}
              key={book.id}
            />
          ))}
      </Container>
      {loading && <CircularProgress />}
      {error && <ErrorAlert message={error} />}
      {(booksError as string) && <ErrorAlert message={booksError as string} />}
    </Container>
  );
}
