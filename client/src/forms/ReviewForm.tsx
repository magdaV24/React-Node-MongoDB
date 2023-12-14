import {
  Container,
  Typography,
  TextField,
  Button,
  Rating,
  Modal,
  Box,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContextProvider";
import useAddReview from "../hooks/useAddReview";
import ErrorAlert from "../components/global/ErrorAlert";
import SuccessAlert from "../components/global/SuccessAlert";
import { useAuthContext } from "../hooks/useAuthContext";

interface Props {
  book_id: string;
  open: boolean;
  close: () => void;
}
const style = {
  width: 600,
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  bgcolor: "secondary.light",
  boxShadow: 24,
  p: 4,
  borderRadius: "2px",
  mt: 3,
};

const btnStyles = {
  width: "100%",
  height: "3rem",
  fontSize: "1.1rem",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  bgcolor: "primary.dark",
  color: "secondary.dark",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "2px",
};

export default function ReviewForm({ book_id, open, close }: Props) {
  const authContext = useAuthContext();
  const { currentUser, loading, error, message } = useContext(AuthContext);
  const add_review = useAddReview();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();

  const onSubmit = async () => {
    setValue("stars", Number(getValues("stars")));
    const data = {
      id: book_id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      date: new Date(Date.now()),
      user_id: currentUser.id,
      ...getValues(),
    };
    try {
      await add_review(data);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
    reset();
  };

  useEffect(() => {
    if (errors.stars) authContext.setError(errors.stars.message as string);
  }, [authContext, errors.stars]);
  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={style}>
        <Typography variant="h6">Review this book!</Typography>
        <Controller
          name="stars"
          control={control}
          rules={{ required: "A grade is required!" }}
          render={({ field }) => (
            <Rating {...field} defaultValue={0} precision={0.25} />
          )}
        />
        <Controller
          name="finished"
          control={control}
          defaultValue="finished"
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
            >
              <FormControlLabel
                value="Finished"
                control={<Radio />}
                label="Finished"
              />
              <FormControlLabel
                value="DNF"
                control={<Radio />}
                label="Did Not Finish"
              />
            </RadioGroup>
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              id="content"
              placeholder="Review Content"
              minRows={2}
              color="primary"
              {...field}
              autoFocus
              multiline
            />
          )}
        />
        <Controller
          name="spoilers"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              label="Does your review have any spoilers?"
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
            />
          )}
        />

        {loading ? (
          <Box sx={btnStyles}>
            <CircularProgress />
          </Box>
        ) : (
          <Button sx={btnStyles} type="submit" onClick={handleSubmit(onSubmit)}>
            SUBMIT REVIEW
          </Button>
        )}

        {message && <SuccessAlert />}
        {error && <ErrorAlert />}
      </Container>
    </Modal>
  );
}
