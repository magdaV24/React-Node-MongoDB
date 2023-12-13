import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { Book } from "../../../types/Book";
import { useState, useEffect } from "react";

export default function BookTable({published, language, pages, genres}: Book) {
  const [genresArr, setGenresArr] = useState("");

  const set_genres = (genres: string[]) => {
    const array = genres.join(', ');
    return setGenresArr(array);
};
useEffect(()=>{
    set_genres(genres)
  },[genres])
  return (
    <TableContainer
    sx={{
      display: "flex",
      height: "60vh",
      width: "25%",
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
          sx={{ align: "left", backgroundColor: "secondary.dark" }}
        >
          <TableCell>Published:</TableCell>
          <TableCell>{published}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.light" }}
        >
          <TableCell>Pages:</TableCell>
          <TableCell>{pages}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.dark" }}
        >
          <TableCell>Genres:</TableCell>
          <TableCell>{genresArr}</TableCell>
        </TableRow>
        <TableRow
          sx={{ align: "left", backgroundColor: "secondary.light" }}
        >
          <TableCell>Language:</TableCell>
          <TableCell>{language}</TableCell>
        </TableRow>
      </TableHead>
    </Table>
  </TableContainer>
  );
}
