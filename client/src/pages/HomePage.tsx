import { Container} from "@mui/material";
import "../styles/pages/homePage.css";
import BookList from "../components/book-list/BookList";
import useQueryHook from "../hooks/useQueryHook";
import { FETCH_BOOKS } from "../utils/urls";

export default function HomePage() {

  const queryKey = "booksQuery";
  const { data } = useQueryHook(FETCH_BOOKS, queryKey);

  return (
    <Container className="page-wrapper">
        <BookList books={data} />
    </Container>
  );
}
