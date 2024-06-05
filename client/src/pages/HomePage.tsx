// MUI imports
import { Container} from "@mui/material";

// Styles
import "../styles/pages/homePage.css";

// Custom components
import BookList from "../components/book-list/BookList";

// Utils
import { FETCH_BOOKS } from "../utils/urls";
//Custom hooks
import { useAppContext } from "../hooks/useAppContext";
import useQueryHook from "../hooks/useQueryHook";

export default function HomePage() {
  const appContext = useAppContext();
  const index = appContext.bookNumber;
  const queryKey = `bookQuery-${index}`;
  const { data } = useQueryHook(FETCH_BOOKS, queryKey);

  return (
    <Container className="page-wrapper">
        <BookList books={data} />
    </Container>
  );
}
