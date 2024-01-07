import { Controller, useForm } from "react-hook-form";
import { ModalInterface } from "../interfaces/ModalInterface";
import {
  Modal,
  Container,
  TextField,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import ErrorAlert from "../components/global/ErrorAlert";
import { GENRES_LIST } from "../genres";
import {
  bottom_row,
  button_styles,
  container,
  wrapper,
} from "../styles/bookForm";
import SuccessAlert from "../components/global/SuccessAlert";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { PRESET } from "../cloudinary/cloudinary";
import { useAuthContext } from "../hooks/useAuthContext";
import useAddBook from "../hooks/mutations/useAddBookMutation";
import useCloudinary from "../hooks/mutations/useCloudinaryMutation";

export default function BookForm({ open, handleClose }: ModalInterface) {
  const {
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      photos: [] as File[],
      title: "",
      author: "",
      published: "",
      description: "",
      pages: 0,
      language: "English",
      genres: [] as string[],
    },
  });
  const [disabled, setDisabled] = useState(false);
  const authContext = useAuthContext();
  const { message, error } = useContext(AuthContext);

  const { add_book, isLoading } = useAddBook();
  const submit_to_cloudinary = useCloudinary();

  const submitBook = async () => {
    setDisabled(true);
    try {
      const ids = await Promise.all(
        getValues("photos").map(async (photo: string | Blob) => {
          const formData = new FormData();
          formData.append("file", photo);
          formData.append("upload_preset", PRESET);
          const id = await submit_to_cloudinary(formData);
          return id;
        })
      );

      const input = { ...getValues(), photos: ids };
      await add_book(input);
    } catch (error) {
      authContext.setError(`Error: ${error}`);
    }
    setDisabled(false);
  };

  useEffect(() => {
    if (errors.title) {
      authContext.setError(`Title error: ${errors.title.message}`);
    } else if (errors.author) {
      authContext.setError(`Error: ${errors.author.message}`);
    } else if (errors.published) {
      authContext.setError(`Published error: ${errors.published.message}`);
    } else if (errors.pages)
      authContext.setError(`Pages error: ${errors.pages.message}`);
    else if (errors.genres) {
      authContext.setError(`Genres error: ${errors.genres.message}`);
    } else if (errors.language) {
      authContext.setError(`Language error: ${errors.language.message}`);
    } else if (errors.description) {
      authContext.setError(`Description error: ${errors.description.message}`);
    } else if (errors.photos) {
      authContext.setError(`Photos error: ${errors.photos.message}`);
    } else if (authContext.error !== "") {
      authContext.setError(`Error: ${authContext.error}`);
      authContext.setOpenError(true)
    } else {
      authContext.clearError();
    }
  }, [
    authContext,
    errors.author,
    errors.description,
    errors.genres,
    errors.language,
    errors.pages,
    errors.photos,
    errors.published,
    errors.title,
  ]);
  return (
    <Modal open={open} onClose={handleClose} sx={{ overflow: "scroll" }}>
      <>
        <Container sx={wrapper}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: "Title required!",
            }}
            render={({ field }) => (
              <TextField
                id="title-standard-basic"
                label="Title"
                variant="outlined"
                autoFocus
                {...field}
              />
            )}
          />
          <Controller
            name="author"
            control={control}
            rules={{
              required: "Author required!",
            }}
            render={({ field }) => (
              <TextField
                id="author-standard-basic"
                label="Author"
                variant="outlined"
                autoFocus
                {...field}
              />
            )}
          />
          <Controller
            name="published"
            control={control}
            rules={{
              required: "Date of publication required!",
            }}
            render={({ field }) => (
              <TextField
                id="published-standard-basic"
                label="Date of publication (DD/MM/YYYY)"
                variant="outlined"
                autoFocus
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: "Synopsis required!",
            }}
            render={({ field }) => (
              <TextField
                id="description-standard-basic"
                label="Synopsis"
                variant="outlined"
                multiline
                minRows={5}
                autoFocus
                {...field}
              />
            )}
          />
          <Controller
            name="pages"
            control={control}
            rules={{
              required: "Number of pages required!",
            }}
            render={({ field }) => (
              <TextField
                id="pages-standard-basic"
                label="Pages"
                variant="outlined"
                autoFocus
                type="number"
                {...field}
                inputProps={{
                  min: 0,
                  step: 1,
                }}
              />
            )}
          />
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Controller
              name="language"
              control={control}
              defaultValue="English"
              rules={{ required: "The language is required!" }}
              render={({ field }) => (
                <Select {...field} labelId="language-select" label="Language">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                  <MenuItem value="Latin">Latin</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                  <MenuItem value="Romanian">Romanian</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="Japanese">Japanese</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <Container sx={container}>
            <Container sx={bottom_row}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="genres-input">Genres</InputLabel>
                <Controller
                  name="genres"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="genres-label"
                      id="genres-id"
                      multiple
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      input={<OutlinedInput label="Genres" />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {GENRES_LIST.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          <Checkbox checked={field.value.indexOf(genre) > -1} />
                          <ListItemText primary={genre} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Controller
                name="photos"
                rules={{ required: "At least a photo is required!" }}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    <InputLabel htmlFor="images">Images</InputLabel>
                    <input
                      id="images"
                      type="file"
                      accept="/images*"
                      multiple
                      onChange={(e) =>
                        field.onChange([...field.value, ...e.target.files!])
                      }
                    />
                    <FormHelperText>Upload photos</FormHelperText>
                    <ul>
                      {field.value.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </>
                )}
              />
            </Container>
          </Container>
          {isLoading ? (
            <Button sx={button_styles}>
              <CircularProgress />
            </Button>
          ) : (
            <Button
              sx={button_styles}
              type="submit"
              onClick={handleSubmit(submitBook)}
              disabled={disabled}
            >
              ADD BOOK
            </Button>
          )}
        </Container>
        {message && <SuccessAlert />}
        {error && <ErrorAlert />}
      </>
    </Modal>
  );
}
