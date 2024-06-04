import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import { Fab } from "@mui/material";
interface Props {
  handleSetOpen: () => void;
}
export default function ReviewButton({ handleSetOpen }: Props) {
  return (
    <Fab variant="extended" onClick={handleSetOpen} title="Add Review Button">
      <CreateSharpIcon sx={{ mr: 1 }} />
      Write a Review
    </Fab>
  );
}
