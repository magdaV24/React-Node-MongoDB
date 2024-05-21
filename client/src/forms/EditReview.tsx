import {
  Box,
  CardContent,
  Divider,
  Rating,
  Button,
  CardActions,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from "@mui/material";
import { Review } from "../types/Review";
import { useAppContext } from "../hooks/useAppContext";
import "../styles/components/reviewCard.css";
import { Controller, useForm } from "react-hook-form";
import useMutationWithToken from "../hooks/useMutationWithToken";
import { EDIT_REVIEW } from "../utils/urls";

interface Props {
  review: Review;
  userId: string;
  bookId: string;
  cancel: () => void;
}
export default function EditReview({ review, bookId, cancel }: Props) {
  const { handleSubmit, control, getValues } = useForm();
  const appContext = useAppContext();

  const { postData, loading } = useMutationWithToken(EDIT_REVIEW);
  const submitEdit = async () => {
    try {
      const input = {
        id: review._id,
        ...getValues(),
        bookId,
        oldStars: review.stars,
      };
      await postData(input);
    } catch (error) {
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error submitting the edit: ${error}`);
    }
  };
  return (
    <Box className="review-card-wrapper">
      <CardContent sx={{ width: "100%" }}>
        <Controller
          name="stars"
          control={control}
          defaultValue={review.stars}
          rules={{ required: "A grade is required!" }}
          render={({ field }) => <Rating {...field} precision={0.25} />}
        />
        <Box className="review-card-content">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                id="content"
                defaultValue={review.content}
                placeholder="Review Content"
                minRows={2}
                color="primary"
                {...field}
                autoFocus
                multiline
                sx={{ width: "100%" }}
              />
            )}
          />
          <Controller
            name="finished"
            control={control}
            defaultValue={review.finished}
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
        </Box>
      </CardContent>
      <Divider className="divider" />
      <CardActions>
        <Button onClick={cancel}>Cancel</Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" onClick={handleSubmit(submitEdit)}>
            Submit Edit
          </Button>
        )}
      </CardActions>
    </Box>
  );
}
