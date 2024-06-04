import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import useMutationWithToken from "../hooks/useMutationWithToken";
import { DELETE_BOOK } from "../utils/urls";
import { useForm } from "react-hook-form";
import { useAppContext } from "../hooks/useAppContext";
interface Props {
  bookId: string | undefined;
  photos: string[] | undefined;
  close: () => void;
}
export default function DeleteBook({ close, bookId, photos }: Props) {
  const { handleSubmit } = useForm();
  const appContext = useAppContext();
  const queryToInvalidate = "booksQuery";
  const { postData, loading } = useMutationWithToken(
    DELETE_BOOK,
    queryToInvalidate
  );

  const onSubmit = async () => {
    try {
      const input = {
        id: bookId,
        photos: photos,
      };
      const result = await postData(input);
      appContext.setSuccess(`${result}`);
      appContext.setOpenSuccessAlert(true);
    } catch (error) {
      appContext.setError(`Error while deleting the book: ${error}`);
      appContext.setOpenErrorAlert(true);
    }
  };
  return (
    <Card className="form-wrapper" component="form" title="Delete Form">
      <Box className="form-header">
        <Typography>Are you sure you want to delete this book?</Typography>
      </Box>
      <Divider />
      <Box>
        <Button color="primary" variant="outlined" onClick={close}>
          Cancel
        </Button>

        {loading ? (
          <Button className="login-button" variant="contained" disabled>
            <CircularProgress />
          </Button>
        ) : (
          <Button
            color="error"
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Delete Book
          </Button>
        )}
      </Box>
    </Card>
  );
}
