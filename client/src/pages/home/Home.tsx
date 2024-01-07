import { Container } from "@mui/material";
import Bar from "../../components/global/Bar";
import { Book } from "../../types/Book";
import BookThumbnail from "./components/BookThumbnail";
import { grid, home_wrapper } from "../../styles/homePage";
import useFetchBooks from "../../hooks/queries/useFetchBooks";

export default function Home() {
  const { data: books } = useFetchBooks();
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
    </Container>
  );
}
