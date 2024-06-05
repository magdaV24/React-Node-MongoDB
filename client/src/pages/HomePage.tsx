import { Container} from "@mui/material";
import "../styles/pages/homePage.css";
import BookList from "../components/book-list/BookList";
import useQueryHook from "../hooks/useQueryHook";
import { FETCH_BOOKS } from "../utils/urls";
import { useEffect } from "react";
import { useAppContext } from "../hooks/useAppContext";

export default function HomePage() {
  const appContext = useAppContext();
  const index = appContext.bookNumber;
  const queryKey = `bookQuery-${index}`;
  const { data, triggerQuery } = useQueryHook(FETCH_BOOKS, queryKey);

  useEffect(()=>{
    triggerQuery();
  },[triggerQuery])
  return (
    <Container className="page-wrapper">
        <BookList books={data} />
    </Container>
  );
}
