import {
  Container,
  Typography,
  TextField,
  Button,
  Rating,
  Modal,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContextProvider";
import { useAuthContext } from "../hooks/useAuthContext";
import { btnStyles, reviewFormStyle } from "../styles/app";
import useAddReview from "../hooks/mutations/useAddReviewMutation";

interface Props {
  book_id: string;
  open: boolean;
  close: () => void;
}

export default function ReviewForm({ book_id, open, close }: Props) {
  const authContext = useAuthContext();
  const { currentUser } = useContext(AuthContext);
  const { add_review, reviewLoading } = useAddReview();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();

  const onSubmit = async () => {
    authContext.setDisabled(true);
    setValue("stars", Number(getValues("stars")));
    const data = {
      id: book_id,
      username: currentUser!.username,
      avatar: currentUser!.avatar,
      date: new Date(Date.now()),
      user_id: currentUser!.id,
      ...getValues(),
    };
    try {
      await add_review(data);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    reset();
    authContext.setDisabled(false);
  };

  useEffect(() => {
    if (errors.stars)
      authContext.setError(`Review error: ${errors.stars.message}`);
    if (errors.content)
      authContext.setError(`Review error: ${errors.content.message}`);
  }, [authContext, errors.content, errors.stars]);
  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={reviewFormStyle}>
        <Typography variant="h6">Review this book!</Typography>
        <Controller
          name="stars"
          control={control}
          defaultValue={0}
          rules={{ required: "A grade is required!" }}
          render={({ field }) => <Rating {...field} precision={0.25} />}
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
          rules={{ required: "Your review has no content!" }}
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

        {reviewLoading ? (
          <Button
            variant="contained"
            disabled={authContext.disabled}
            sx={btnStyles}
          >
            <CircularProgress />
          </Button>
        ) : (
          <Button
            sx={btnStyles}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={authContext.disabled}
          >
            SUBMIT REVIEW
          </Button>
        )}
      </Container>
    </Modal>
  );
}
