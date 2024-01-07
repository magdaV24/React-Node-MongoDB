import {
  Modal,
  Container,
  Rating,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { edit_review_button, edit_review_wrapper } from "../../styles/editReview";
import { Review } from "../../types/Review";
import useEditReview from "../../hooks/mutations/useEditReviewMutation";

interface Props {
  review: Review;
  book_id: string;
  open: boolean;
  close: () => void;
}
export default function ReviewEditForm({
  review,
  book_id,
  open,
  close,
}: Props) {

  const {
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm();

const {edit_review, editReviewLoading} = useEditReview();
  const onSubmit = async () => {
    const data = {
      id: review?._id,
      book_id: book_id,
      old_stars: review?.stars,
      ...getValues()
    };
    try {
      await edit_review(data);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
    reset()
  };

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container sx={edit_review_wrapper}>
          <Controller
            name="newStars"
            control={control}
            render={({ field }) => (
              <Rating {...field} defaultValue={review?.stars} precision={0.25} />
            )}
          />

          <Controller
            name="newFinished"
            control={control}
            defaultValue={review?.finished}
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
            name="newContent"
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                multiline
                minRows={4}
                {...field}
                variant="standard"
                sx={{ width: "100%" }}
                defaultValue={review?.content}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {editReviewLoading ? (
            <Box sx={edit_review_button}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              sx={edit_review_button}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              SUBMIT REVIEW
            </Button>
          )}
        </Container>
      </Modal>
    </>
  );
}
