import { useState } from "react";
import SuccessAlert from "../../../components/SuccessAlert";
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
import ErrorAlert from "../../../components/ErrorAlert";
import { EDIT_REVIEW } from "../../../api/urls";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import postData from "../../../functions/postData";

interface Props {
  id: string;
  content: string;
  stars: number;
  finished: string;
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
  mt: 10,
};

const btnStyles = {
  width: "100%",
  height: "3rem",
  fontSize: "1.1rem",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  bgcolor: "primary.dark",
  color: "secondary.dark",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function ReviewEditForm({
  id,
  content,
  stars,
  finished,
  book_id,
  open,
  close,
}: Props) {
  const [message, setMessage] = useState("");
  // const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const edit_review_mutation = useMutation(
    (input: unknown) => submit_edit(input),
    {
      onSuccess: (res) => {
        if(res === 'Success!'){
          setMessage("Success")
        }
      },
    }
  );

  const submit_edit = async (input: unknown) => {
    try {
      return await postData(EDIT_REVIEW, input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  const onSubmit = async () => {
    const data = {
      id: id,
      book_id: book_id,
      old_stars: stars,
      content: getValues("newContent"),
      stars: getValues("newStars"),
      finished: getValues("newFinished"),
    };
    edit_review_mutation.mutate(data)
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
        <Container sx={style}>
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
          {edit_review_mutation.isLoading ? (
            <Box sx={btnStyles}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              sx={btnStyles}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              SUBMIT REVIEW
            </Button>
          )}

          {message && <SuccessAlert message={message} />}
          {/* {error && <ErrorAlert message={error} />} */}
        </Container>
      </Modal>
    </>
  );
}
