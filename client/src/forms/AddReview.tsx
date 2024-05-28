import {
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
  Card,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../hooks/useAppContext";
import useMutationWithToken from "../hooks/useMutationWithToken";
import { ADD_REVIEW } from "../utils/urls";

interface Props {
  userId: string | null;
  bookId: string;
  open: boolean;
  close: () => void;
}

export default function AddReview({ userId, bookId, open, close }: Props) {
  const appContext = useAppContext();

  const { postData, loading } = useMutationWithToken(ADD_REVIEW);
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
      id: bookId,
      date: new Date(Date.now()),
      userId: userId,
      ...getValues(),
    };
    try {
      await postData(data).then((res: string) => {
        appContext.setSuccess(res);
        appContext.setOpenSuccessAlert(true);
      });
    } catch (error) {
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error while trying to submit your review: ${error}`);
    }
    reset();
  };

  useEffect(() => {
    if (errors.stars) {
      appContext.setError(`Review error: ${errors.stars.message}`);
      appContext.setOpenErrorAlert(true);
    }
    if (errors.content) {
      appContext.setError(`Review error: ${errors.content.message}`);
      appContext.setOpenErrorAlert(true);
    }
  }, [appContext, errors.content, errors.stars]);
  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Card className="form-wrapper">
        <Typography variant="h6" title="Review Form">
          Review this book!
        </Typography>
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

        {loading ? (
          <Button variant="contained" disabled>
            <CircularProgress />
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            SUBMIT REVIEW
          </Button>
        )}
      </Card>
    </Modal>
  );
}
