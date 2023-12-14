import { useContext, useEffect } from "react";
import { useFetchBooks } from "../../hooks/queries/useFetchBooks";
import { AuthContext } from "../../context/AuthContextProvider";
import { Container, CircularProgress } from "@mui/material";
import Bar from "../../components/global/Bar";
import { Book } from "../../types/Book";
import ErrorAlert from "../../components/global/ErrorAlert";
import BookThumbnail from "./components/BookThumbnail";
import { grid, home_wrapper } from "../../styles/homePage";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Home() {
  const authContext = useAuthContext();
  const { data: books, error: booksError } = useFetchBooks();
  const { error, loading } = useContext(AuthContext);
  useEffect(() => {
    if (booksError) {
      authContext.setError(booksError as string);
    }
  }, [authContext, booksError]);
  return (
    <Container sx={home_wrapper}>
      <Bar />
      <Container sx={grid}>
        {books &&
          books.map((book: Book) => (
            <BookThumbnail
              image={book.photos[0] as unknown as string}
              title={book.title}
              author={book.author}
              key={book._id}
            />
          ))}
      </Container>
      {loading && <CircularProgress />}
      {error && <ErrorAlert />}
      {(booksError as string) && <ErrorAlert />}
    </Container>
  );
}
