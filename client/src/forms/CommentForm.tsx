import { useContext , useEffect} from "react";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContextProvider";
import { AVATAR_ANON } from "../cloudinary/cloudinary";
import { CommentInput } from "../interfaces/CommentsInput";
import useAddComment from "../hooks/mutations/useAddCommentMutation";
import { useAuthContext } from "../hooks/useAuthContext";
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
}
export default function CommentForm({ parent_id }: Props) {
  const { currentUser, book } = useContext(AuthContext);
  const book_id = book!._id;
  const authContext = useAuthContext()
  const date = new Date(new Date());

  const { handleSubmit, control, getValues, formState: { errors } } = useForm();

  const { add_comment, addCommentLoading } = useAddComment();

  const submitComment = async () => {
    const input = {
      parent_id: parent_id,
      book_id: book_id,
      date: date,
      content: getValues("content"),
    };
    if (currentUser) {
      const data: CommentInput = {
        user_id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        ...input,
      };
      try {
        await add_comment(data);
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    } else {
      const data: CommentInput = {
        user_id: "Anon_Comment",
        username: "Anonymous",
        avatar: AVATAR_ANON,
        ...input,
      };
      try {
        await add_comment(data);
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }
  };

  useEffect(() => {
    if (errors.content)
      authContext.setError(`Content error: ${errors.content.message}`);
    else if (authContext.error !== "") {
      authContext.setError(authContext.error);
      authContext.setOpenError(true);
    } else if (authContext.message !== "") {
      authContext.setMessage(authContext.message);
      authContext.setOpenMessage(true);
    } else {
      authContext.clearError();
      authContext.clearMessage();
    }
  }, [authContext, errors.content]);

  return (
    <>
      <Container sx={style} component="form">
        <Controller
          name="content"
          control={control}
          defaultValue=''
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
        {addCommentLoading ? (
          <Button sx={btnStyles}>
            <CircularProgress />
          </Button>
        ) : (
          <Button
            sx={btnStyles}
            type="submit"
            onClick={handleSubmit(submitComment)}
          >
            <SendSharpIcon />
          </Button>
        )}
      </Container>
    </>
  );
}

