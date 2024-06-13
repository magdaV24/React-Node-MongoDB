import {
  CardContent,
  Divider,
  CardActions,
  Button,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Comment } from "../types/Comment";
import "../styles/components/commentCard.css";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../hooks/useAppContext";
import useMutationWithToken from "../hooks/useMutationWithToken";
import { EDIT_COMMENT } from "../utils/urls";

interface Props {
  comment: Comment;
  cancel: () => void;
  userId: string | undefined;
}

export default function EditComment({ comment, cancel }: Props) {
  const { control, getValues, handleSubmit } = useForm();
  const appContext = useAppContext();
  const { postData, loading } = useMutationWithToken(EDIT_COMMENT);
  const submitEdit = async () => {
    try {
      const input = {
        id: comment._id,
        content: getValues("content"),
      };
      await postData(input);
    } catch (error) {
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error while submitting the edit: ${error}`);
    }
  };
  return (
    <Box
      sx={{
        width: "99%",
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column",
        alignItems: "center",
        p: 0,
      }}
    >
        <CardContent sx={{ width: "100%" }}>
          <Box className="review-card-content">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  id="content"
                  defaultValue={comment.content}
                  minRows={2}
                  color="primary"
                  {...field}
                  autoFocus
                  multiline
                  sx={{ width: "100%" }}
                />
              )}
            />
          </Box>
          <Divider className="divider" />
        </CardContent>
        <CardActions>
          <Box className="comment-card-buttons-wrapper">
            <Box className="comment-card-buttons-col-one">
              <Button onClick={cancel}>Cancel Edit</Button>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button type="submit" onClick={handleSubmit(submitEdit)}>
                  Submit Edit
                </Button>
              )}
            </Box>
          </Box>
        </CardActions>
    </Box>
  );
}
