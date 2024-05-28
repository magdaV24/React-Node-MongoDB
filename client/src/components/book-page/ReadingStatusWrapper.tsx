import { Box } from "@mui/material";
import { Book } from "../../types/Book";
import ReadingStatus from "../ReadingStatus";
import ReviewButton from "./ReviewButton";

interface Props {
  handleSetOpen: () => void;
  id: string;
  book: Book;
}
export default function ReadingStatusWrapper({
  handleSetOpen,
  id,
  book,
}: Props) {
  return (
    <Box className="reading-status-wrapper">
      <ReadingStatus userId={id!} bookId={book!._id} />
      <ReviewButton handleSetOpen={handleSetOpen} />
    </Box>
  );
}
