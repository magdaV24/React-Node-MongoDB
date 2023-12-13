import { useContext } from "react";
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
import { AuthContext } from "../../context/AuthContextProvider";
import ErrorAlert from "../../components/global/ErrorAlert";
import SuccessAlert from "../../components/global/SuccessAlert";
import useEditReview from "../../hooks/useEditReview";
import { edit_review_button, edit_review_wrapper } from "../../styles/editReview";

interface Props {
  id: string;
  content: string;
  stars: number;
  finished: string;
  book_id: string;
  open: boolean;
  close: () => void;
}
export default function ReviewEditForm({
  id,
  content,
  stars,
  finished,
  book_id,
  open,
  close,
}: Props) {

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

const { message, error, loading} = useContext(AuthContext);
const edit_review = useEditReview();
  const onSubmit = async () => {
    const data = {
      id: id,
      book_id: book_id,
      old_stars: stars,
      ...getValues()
    };
    try {
      await edit_review(data);
    } catch (error) {
      throw new Error(`Error: ${error}`)
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
              <Rating {...field} defaultValue={stars} precision={0.25} />
            )}
          />
          {errors.newStars && (
            <ErrorAlert message={errors.newStars.message as string} />
          )}

          <Controller
            name="newFinished"
            control={control}
            defaultValue={finished}
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
          {errors.newFinished && (
            <ErrorAlert message={errors.newFinished.message as string} />
          )}

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
                defaultValue={content}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.newContent && (
            <ErrorAlert message={errors.newContent.message as string} />
          )}
          {loading ? (
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

          {message && <SuccessAlert message={message} />}
          {error && <ErrorAlert message={error} />}
        </Container>
      </Modal>
    </>
  );
}
