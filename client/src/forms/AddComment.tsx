import { useEffect } from "react";
import { Container, TextField, Button, CircularProgress } from "@mui/material";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../hooks/useAppContext";
import { ADD_COMMENT } from "../utils/urls";
import useMutationHook from "../hooks/useMutationHook";
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
  parentId: string;
  userId: string | undefined;
  bookId: string | null;
  close: ()=>void
}
export default function AddComment({ parentId, userId, bookId, close }: Props) {
  const date = new Date(new Date());
  const appContext = useAppContext();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const queryToInvalidate = `commentsList/${parentId}`
  const { postData, loading } = useMutationHook(ADD_COMMENT, queryToInvalidate);

  const submitComment = async () => {
    try {
      const input = {
        parentId: parentId,
        userId: userId,
        bookId: bookId,
        date: date,
        content: getValues("content"),
      };
      await postData(input);
      close();
    } catch (error) {
      appContext.setError(`Error while submitting the comment: ${error}`);
      appContext.setOpenErrorAlert(true);
    }
  };

  useEffect(() => {
    if (errors.content)
      appContext.setError(`Content error: ${errors.content.message}`);
    else if (appContext.error !== "") {
      appContext.setError(appContext.error);
      appContext.setOpenErrorAlert(true);
    } else if (appContext.success !== "") {
      appContext.setSuccess(appContext.success);
      appContext.setOpenSuccessAlert(true);
    } else {
      appContext.clearErrorMessage();
      appContext.clearSuccessMessage();
    }
  }, [appContext, errors.content]);

  return (
    <>
      <Container sx={style} component="form">
        <Controller
          name="content"
          control={control}
          defaultValue=""
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
