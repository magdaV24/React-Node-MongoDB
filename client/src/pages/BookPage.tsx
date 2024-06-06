// React and React-Router-Dom imports
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Helmet
import { Helmet } from "react-helmet";

// MUI imports
import { Container, Button, Box } from "@mui/material";

// Custom Hooks
import useQueryHook from "../hooks/useQueryHook";
import useGetUser from "../hooks/useGetUser";

// Custom Components
import AddReview from "../forms/AddReview";
import ReviewList from "../components/ReviewsList";

// Context Management
import { useAppContext } from "../hooks/useAppContext";

// URLs
import { FETCH_BOOK } from "../utils/urls";

// CSS imports
import "../styles/pages/bookPage.css";

// Types
import { Book } from "../types/Book";
import BookTable from "../components/book-page/BookTable";
import BookDescription from "../components/book-page/BookDescription";
import FixedCard from "../components/book-page/FixedCard";

interface Props {
  id: string | null;
}

export default function BookPage({ id }: Props) {
  const location = useLocation();

  const title: string = location.pathname
    .split("/")[1]
    .split("%20")
    .toString()
    .replace(/[",]/g, " "); // Cleaning the string that contains the book's title from the page's URL

  const queryKey = `bookQuery/${id}`;
  const { data: book } = useQueryHook(`${FETCH_BOOK}/${title}`, queryKey, true);
  const appContext = useAppContext();

  const [open, setOpen] = useState(false);

  function onClose() {
    setOpen(false);
  }
  function handleSetOpen() {
    setOpen(true);
  }
  const [genres, setGenres] = useState("");

  const editGenres = (genres: string[]) => {
    const array = genres.join(", ");
    return setGenres(array);
  };

  useEffect(() => {
    if (book) {
      editGenres(book.genres);
    }
    if (appContext.error !== "") {
      appContext.setError(appContext.error);
    }
  }, [appContext, book, location.pathname]);

  const [showReviews, setShowReviews] = useState(false); // The user can choose if they want to see the reviews

  const user = useGetUser(id);

  return (
    <Container className="page-wrapper">
      {(book as Book) && (
        <>
        {/* the tab will now be customized to have the book's title and author in it */}
          <Helmet>
            <title>
              {book.title
                ? `${book.title} by ${book.author} | NovelNotes`
                : "NovelNotes"}
            </title>
          </Helmet>
          <Box className="book-wrapper" title={`book-page-${book.id}`}>
            <FixedCard user={user} book={book} handleSetOpen={handleSetOpen} />
            <Box className="book-info">
              <Box className="book-table-wrapper">
                <BookDescription description={book.description} />
                <BookTable book={book} genres={genres} />
              </Box>
              {user && (
                <AddReview
                  userId={id}
                  bookId={book._id}
                  open={open}
                  close={onClose}
                />
              )}
              <Button
                variant="outlined"
                onClick={() => setShowReviews((prev) => !prev)}
                className="show-reviews-button"
                title="Show Reviews"
              >
                {showReviews ? "Hide Reviews" : "Show Reviews"}
              </Button>
              {showReviews && <ReviewList bookId={book._id} userId={id} />}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}
