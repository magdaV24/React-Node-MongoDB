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
  Box,
  CircularProgress,
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
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import useAddBook from "../hooks/useAddBook";
import useCloudinary from "../hooks/useCloudinary";
import { PRESET } from "../cloudinary/cloudinary";

export default function BookForm({ open, handleClose }: ModalInterface) {
  const {
    handleSubmit,
    getValues,
    formState: { errors },
    control,
    setValue,
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

  const { loading, message, error } = useContext(AuthContext);

  const add_book = useAddBook();
  const submit_to_cloudinary = useCloudinary();

  //   const ids = [] as string[];

  const onSubmit = async () => {
    try {
      const ids = await Promise.all(
        getValues("photos").map(async (photo: string | Blob) => {
          const formData = new FormData();
          formData.append("file", photo);
          formData.append("upload_preset", PRESET);

          try {
            const id = await submit_to_cloudinary(formData);
            return id;
          } catch (error) {
            throw new Error(`Error: ${error}`);
          }
        })
      );
      const input = { ...getValues(), photos: ids };
      await add_book(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  return (
    <Modal open={open} onClose={handleClose} sx={{ overflow: "scroll" }}>
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
        {errors.title && (
          <ErrorAlert message={errors.title.message as string} />
        )}
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
        {errors.author && (
          <ErrorAlert message={errors.author.message as string} />
        )}
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
        {errors.published && (
          <ErrorAlert message={errors.published.message as string} />
        )}
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
        {errors.description && (
          <ErrorAlert message={errors.description.message as string} />
        )}
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
        {errors.pages && (
          <ErrorAlert message={errors.pages.message as string} />
        )}
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
        {errors.language && (
          <ErrorAlert message={errors.language.message as string} />
        )}
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

            {errors.genres && (
              <ErrorAlert message={errors.genres.message as string} />
            )}
            <Controller
              name="photos"
              control={control}
              rules={{ required: "At least a photo is required!" }}
              render={({ field }) => (
                <Button variant="contained">
                  Upload photos
                  <input
                    id="photos-standard-basic"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const photos = Array.from(e.target.files || []);
                      setValue("photos", [...field.value, ...photos]);
                    }}
                    key={Math.random()}
                    // style={{display: 'none'}}
                  />
                </Button>
              )}
            />
            {errors.photos && (
              <ErrorAlert message={errors.photos.message as string} />
            )}
          </Container>
        </Container>
        {loading ? (
          <Box sx={button_styles}>
            <CircularProgress />
          </Box>
        ) : (
          <Button
            sx={button_styles}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            ADD BOOK
          </Button>
        )}

        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert message={error} />}
      </Container>
    </Modal>
  );
}
