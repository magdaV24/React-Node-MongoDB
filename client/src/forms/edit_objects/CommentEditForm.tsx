import {
  Container,
  TextField,
  Button,
  Box,
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
  const { loading, message, error } = useContext(AuthContext);

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const edit_comment = useEditComment();

  const submitEdit = async () => {
    const data = {
      id: id,
      content: getValues("content"),
    };
    edit_comment(data);
    reset();
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
      {errors.content && (
        <ErrorAlert message={errors.content.message as string} />
      )}
      {loading ? (
        <Box sx={edit_comment_button}>
          <CircularProgress />
        </Box>
      ) : (
        <Button
          sx={edit_comment_button}
          type="submit"
          onClick={handleSubmit(submitEdit)}
        >
          <SendSharpIcon />
        </Button>
      )}

      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert message={error} />}
    </Container>
  );
}
