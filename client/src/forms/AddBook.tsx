import { Controller, useForm } from "react-hook-form";
import {
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
  Box,
  Card,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAppContext } from "../hooks/useAppContext";
import useCloudinary from "../hooks/useCloudinary";
import useMutationHook from "../hooks/useMutationHook";
import { FOLDER_NAME, PRESET } from "../utils/cloudinary";
import { GENRES_LIST } from "../utils/genres";
import { ADD_BOOK } from "../utils/urls";
import { useEffect } from "react";
import { LANGUAGES } from "../utils/languages";
import { VisuallyHiddenInput } from "../utils/VisuallyHiddenInput";

export default function AddBook() {
  const {
    handleSubmit,
    getValues,
    setValue,
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

  const appContext = useAppContext();
  const submitToCloudinary = useCloudinary();
  const { postData, loading } = useMutationHook(ADD_BOOK);

  const submitBook = async () => {
    try {
      const ids = await Promise.all(
        getValues("photos").map(async (photo: string | Blob) => {
          const formData = new FormData();
          formData.append("file", photo);
          formData.append("upload_preset", PRESET);
          formData.append("folder", FOLDER_NAME);
          const id = await submitToCloudinary(formData);
          return id;
        })
      );
      setValue("photos", ids);
      const input = { ...getValues() };
      await postData(input);
    } catch (error) {
      appContext.setError(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (errors.title) {
      appContext.setError(`Title error: ${errors.title.message}`);
    } else if (errors.author) {
      appContext.setError(`Error: ${errors.author.message}`);
    } else if (errors.published) {
      appContext.setError(`Published error: ${errors.published.message}`);
    } else if (errors.pages)
      appContext.setError(`Pages error: ${errors.pages.message}`);
    else if (errors.genres) {
      appContext.setError(`Genres error: ${errors.genres.message}`);
    } else if (errors.language) {
      appContext.setError(`Language error: ${errors.language.message}`);
    } else if (errors.description) {
      appContext.setError(`Description error: ${errors.description.message}`);
    } else if (errors.photos) {
      appContext.setError(`Photos error: ${errors.photos.message}`);
    } else if (appContext.error !== "") {
      appContext.setError(`Error: ${appContext.error}`);
      appContext.setOpenErrorAlert(true);
    } else {
      appContext.clearErrorMessage();
    }
  }, [
    appContext,
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
    <Card className="form-wrapper">
      <Box className="form-header" title="Add Book Form">
        <Typography component='div' variant="h4">New Book</Typography>
      </Box>
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
              {LANGUAGES.map((language)=>(
                <MenuItem value={language} key={Math.random()}>{language}</MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      <Box>
        <Box>
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
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Add photos
                <VisuallyHiddenInput
                  type="file"
                  multiple
                  onChange={(e) =>
                    field.onChange([...field.value, ...e.target.files!])
                  }
                />
              </Button>
            )}
          />
        </Box>
      </Box>
      {loading ? (
        <Button disabled>
          <CircularProgress />
        </Button>
      ) : (
        <Button type="submit" onClick={handleSubmit(submitBook)}>
          ADD BOOK
        </Button>
      )}
    </Card>
  );
}
