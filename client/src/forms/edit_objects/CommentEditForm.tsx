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
import SuccessAlert from "../../components/global/SuccessAlert";
import useEditComment from "../../hooks/useEditComment";
import ErrorAlert from "../../components/global/ErrorAlert";

interface Props {
  content: string;
  id: string;
}

export default function CommentEditForm({ content, id }: Props) {
  const { message, error, disabled, setDisabled } = useContext(AuthContext);

  const { handleSubmit, control, getValues } = useForm();

  const { edit_comment, editCommentLoading } = useEditComment();

  const submitEdit = async () => {
    setDisabled(true);
    const data = {
      id: id,
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
            defaultValue={content}
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

      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Container>
  );
}
