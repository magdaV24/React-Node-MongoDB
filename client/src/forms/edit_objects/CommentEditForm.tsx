import { Container, TextField, Button, Box, CircularProgress } from "@mui/material";
import SendSharpIcon from '@mui/icons-material/SendSharp';
import { Controller, useForm } from "react-hook-form";
import postData from "../../../functions/postData";
import { EDIT_COMMENT } from "../../../api/urls";
import { useMutation } from "react-query";
import ErrorAlert from "../../../components/ErrorAlert";

interface Props{
    content: string,
    id: string
}

const style = {
    width: "100%",
    height: '20vh',
    display: "flex",
    gap: "2vw",
    bgcolor: "secondary.light",
    boxShadow: 24,
    p: 1,
    borderRadius: "2px",
    mb: 2,
    mt: 2
  };
  
  const btnStyles = {
    width: "10%",
    height: "100%",
    fontSize: "1.1rem",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    bgcolor: "primary.dark",
    color: "secondary.dark",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

export default function CommentEditForm({content, id}: Props){
  
      const { handleSubmit, control, getValues, reset, formState: { errors }} = useForm()
      
      const mutation = useMutation(async (input: unknown) => await submit_edit(input))
      const submit_edit = async (input: unknown) => {
        try {
          return postData(EDIT_COMMENT, input)
        } catch (error) {
          throw new Error(`Error: ${error}`)
        }
      }

      const submitEdit = async () => {
        const data = {
          id: id,
          content: getValues("content")
        }
        mutation.mutate(data)
        reset()
      }

    return(
        <>
    <Container sx={style} component="form">
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
         {mutation.isLoading ? (
          <Box sx={btnStyles}>
            <CircularProgress />
          </Box>
        ) : (
          <Button sx={btnStyles} type="submit" onClick={handleSubmit(submitEdit)}>
            <SendSharpIcon />
          </Button>
        )}
      </Container>
        </>
    )
}