import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Book } from "../../types/Book";

interface Props{
 book: Book
}

export default function BookTable({book}: Props) {
  const [genresArr, setGenresArr] = useState("");

  const set_genres = (genres: string[]) => {
    const array = genres.join(', ');
    return setGenresArr(array);
};
useEffect(()=>{
    set_genres(book?.genres)
  },[book?.genres])
  return (
    <TableContainer
    sx={{
      display: "flex",
      height: "60vh",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "column",
      padding: 2,
      overflow: "hidden",
    }}
  >
    <Table>
      <TableHead>
      <TableRow
          sx={{ align: "left" }}
        >
          <TableCell sx={{width: '10%', backgroundColor: "secondary.dark"}}>Title:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "secondary.main"}}>{book?.title}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left"}}
        >
          <TableCell sx={{width: '10%', backgroundColor: "primary.dark"}}>Author:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "primary.main"}}>{book?.author}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.dark" }}
        >
          <TableCell sx={{width: '10%', backgroundColor: "secondary.dark"}}>Published:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "secondary.main"}}>{book?.published}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.light" }}
        >
          <TableCell sx={{width: '10%', backgroundColor: "primary.dark"}}>Pages:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "primary.main"}}>{book?.pages}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.dark" }}
        >
          <TableCell sx={{width: '10%', backgroundColor: "secondary.dark"}}>Genres:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "secondary.main"}}>{genresArr}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.light" }}
        >
          <TableCell sx={{width: '10%', backgroundColor: "primary.dark"}}>Language:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "primary.main"}}>{book?.language}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.dark" }}
        >
          <TableCell sx={{width: '10%', backgroundColor: "secondary.dark"}}>Synopsis:</TableCell>
          <TableCell sx={{width: '90%', backgroundColor: "secondary.main"}}>{book?.description}</TableCell>
        </TableRow>
      </TableHead>
    </Table>
  </TableContainer>
  );
}
