import { Box, Typography } from "@mui/material";
import { Book } from "../../types/Book"
import '../../styles/pages/homePage.css'
import BookCard from "./BookCard";

interface Props{
    books?: Book[];
}

export default function BookList({books = []}: Props) {
    const length = books.length;
 return (
    <Box className="books-wrapper">
          {length > 0 ? <>
            {books.map((book: Book, index: number) => (
            <BookCard book={book} key={`${book?._id}-${index}`} />
          ))}
          </> : <Typography>No books in the database yet!</Typography>}
    </Box>
 )   
}
