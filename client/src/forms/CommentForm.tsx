import { useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContextProvider";
import { AVATAR_ANON } from "../cloudinary/cloudinary";
import useAddComment from "../hooks/useAddComment";
import SuccessAlert from "../components/global/SuccessAlert";
import ErrorAlert from "../components/global/ErrorAlert";
const style = {
  width: "100%",
  height: "20vh",
  display: "flex",
  gap: "2vw",
  bgcolor: "secondary.light",
  boxShadow: 24,
  p: 1,
  borderRadius: "2px",
  mb: 2,
  mt: 2,
};

const btnStyles = {
  width: "10%",
  height: "100%",
  fontSize: "1.1rem",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  bgcolor: "primary.dark",
  color: "secondary.dark",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

interface Props {
  parent_id: string;
  book_id: string;
}
export default function CommentForm({ parent_id, book_id }: Props) {
  const { currentUser, loading, error, message } = useContext(AuthContext);
  const date = new Date(new Date());

  const { handleSubmit, control, getValues } = useForm();

  const add_comment = useAddComment();

  const submitComment = async () => {
    const input = {
      parent_id: parent_id,
      book_id: book_id,
      date: date,
      content: getValues("content"),
    };
    if (currentUser) {
      const data = {
        user_id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        ...input,
      };
      try {
        await add_comment(data);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    } else {
      const data = {
        user_id: "Anon_Comment",
        username: "Anonymous",
        avatar: AVATAR_ANON,
        ...input,
      };
      try {
        await add_comment(data);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    }
  };
  
  return (
    <>
      <Container sx={style} component="form">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              id="standard-basic"
              label="Comment"
              variant="standard"
              autoFocus
              multiline
              {...field}
              minRows={4}
              sx={{ width: "88%", height: "100%" }}
            />
          )}
        />
        {loading ? (
          <Box sx={btnStyles}>
            <CircularProgress />
          </Box>
        ) : (
          <Button
            sx={btnStyles}
            type="submit"
            onClick={handleSubmit(submitComment)}
          >
            <SendSharpIcon />
          </Button>
        )}

        {message && <SuccessAlert />}
        {error && <ErrorAlert />}
      </Container>
    </>
  );
}
