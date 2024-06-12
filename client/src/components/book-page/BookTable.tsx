import { Box,  } from "@mui/material";
import { Book } from "../../types/Book";
interface Props {
  book: Book;
  genres: string;
}
export default function BookTable({ book, genres }: Props) {
  return (
    <Box className="book-table">
        <Box
          sx={{
            backgroundColor: "primary.dark",
          }}
          className='book-table-row'
        >
          <Box className="book-table-row-name">Published:</Box>
          <Box className="book-table-row-value">
            {book!.published}
          </Box>
        </Box>
        <Box sx={{ backgroundColor: "primary.main" }} className='book-table-row'>
          <Box className="book-table-row-name">Pages:</Box>
          <Box className="book-table-row-value">
            {book!.pages}
          </Box>
        </Box>
        <Box sx={{ backgroundColor: "primary.dark" }} title="Genres List" className='book-table-row'>
          <Box className="book-table-row-name">Genres:</Box>
          <Box className="book-table-row-value">{genres}</Box>
        </Box>
        <Box sx={{ backgroundColor: "primary.main" }} className='book-table-row'>
          <Box className="book-table-row-name">Language:</Box>
          <Box className="book-table-row-value">
            {book!.language}
          </Box>
        </Box>
    </Box>
  );
}
