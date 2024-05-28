import { Box, TableHead, TableRow, TableCell } from "@mui/material";
import { Book } from "../../types/Book";
interface Props{
    book: Book;
    genres: string;
}
export default function BookTable({book, genres}: Props) {
    return(
        <Box className="book-table">
        <TableHead sx={{width: '100%'}}>
          <TableRow
            sx={{ align: "left", backgroundColor: "secondary.dark", width: '100%' }}
            
          >
            <TableCell sx={{align: "left",width: '10%',}}>Published:</TableCell>
            <TableCell sx={{align: "left",width: '90%',}}>{book!.published}</TableCell>
          </TableRow>
          <TableRow
            sx={{ align: "left", backgroundColor: "secondary.light" }}
          >
            <TableCell sx={{align: "left",width: '10%',}}>Pages:</TableCell>
            <TableCell sx={{align: "left",width: '90%',}}>{book!.pages}</TableCell>
          </TableRow>
          <TableRow
            sx={{ align: "left", backgroundColor: "secondary.dark" }}
          >
            <TableCell sx={{align: "left",width: '10%',}}>Genres:</TableCell>
            <TableCell sx={{align: "left",width: '90%',}}>{genres}</TableCell>
          </TableRow>
          <TableRow
            sx={{ align: "left", backgroundColor: "secondary.light" }}
          >
            <TableCell sx={{align: "left",width: '10%',}}>Language:</TableCell>
            <TableCell sx={{align: "left",width: '90%',}}>{book!.language}</TableCell>
          </TableRow>
        </TableHead>
      </Box>
    )
}
