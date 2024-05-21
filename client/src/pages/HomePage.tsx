import { Container} from "@mui/material";
import { Book } from "../types/Book";
import "../styles/pages/homePage.css";
import BookList from "../components/book-list/BookList";
interface Props{
  data: Book[]
}
export default function HomePage({data}:Props) {
  return (
    <Container className="page-wrapper">
        <BookList books={data} />
    </Container>
  );
}
