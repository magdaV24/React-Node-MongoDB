import {
  Container,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { Controller, useForm } from "react-hook-form";
import {
  edit_comment_button,
  edit_comment_wrapper,
} from "../../styles/editComment";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import useEditComment from "../../hooks/mutations/useEditCommentMutation";
import { Comment } from '../../types/Comment'

interface Props {
 comment: Comment;
}

export default function CommentEditForm({ comment }: Props) {
  const { disabled, setDisabled } = useContext(AuthContext);

  const { handleSubmit, control, getValues } = useForm();

  const { edit_comment, editCommentLoading } = useEditComment();

  const submitEdit = async () => {
    setDisabled(true);
    const data = {
      id: comment?._id,
      content: getValues("content"),
    };
    edit_comment(data);
    setDisabled(false);
  };

  return (
    <Container sx={edit_comment_wrapper} component="form">
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextField
            autoFocus
            multiline
            minRows={4}
            {...field}
            variant="standard"
            sx={{ width: "100%" }}
            defaultValue={comment?.content}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      {editCommentLoading ? (
        <Button sx={edit_comment_button} disabled={disabled}>
          <CircularProgress />
        </Button>
      ) : (
        <Button
          sx={edit_comment_button}
          type="submit"
          onClick={handleSubmit(submitEdit)}
          disabled={disabled}
        >
          <SendSharpIcon />
        </Button>
      )}
    </Container>
  );
}
