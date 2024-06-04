import { Box,  } from "@mui/material";
import { Book } from "../../types/Book";
interface Props {
  book: Book;
  genres: string;
}
export default function BookTable({ book, genres }: Props) {
  return (
    <Box className="book-table">
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            align: "left",
            backgroundColor: "secondary.dark",
            width: "100%",
          }}
        >
          <Box sx={{ align: "left", width: "10%" }}>Published:</Box>
          <Box sx={{ align: "left", width: "90%" }}>
            {book!.published}
          </Box>
        </Box>
        <Box sx={{ align: "left", backgroundColor: "secondary.light" }}>
          <Box sx={{ align: "left", width: "10%" }}>Pages:</Box>
          <Box sx={{ align: "left", width: "90%" }}>
            {book!.pages}
          </Box>
        </Box>
        <Box sx={{ align: "left", backgroundColor: "secondary.dark" }} title="Genres List">
          <Box sx={{ align: "left", width: "10%" }}>Genres:</Box>
          <Box sx={{ align: "left", width: "90%" }}>{genres}</Box>
        </Box>
        <Box sx={{ align: "left", backgroundColor: "secondary.light" }}>
          <Box sx={{ align: "left", width: "10%" }}>Language:</Box>
          <Box sx={{ align: "left", width: "90%" }}>
            {book!.language}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
