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
  styled,
  Box,
  Card,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import { useAppContext } from "../hooks/useAppContext";
import useCloudinary from "../hooks/useCloudinary";
import { FOLDER_NAME, PRESET } from "../utils/cloudinary";
import { GENRES_LIST } from "../utils/genres";
import { ADD_PHOTO, DELETE_PHOTO, EDIT_FIELDS } from "../utils/urls";
import { useEffect, useRef, useState } from "react";
import { Book } from "../types/Book";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryFnc } from "../utils/cloudinaryFnc";
import { fill } from "@cloudinary/url-gen/actions/resize";
import "../styles/forms/editBook.css";
import useMutationWithToken from "../hooks/useMutationWithToken";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface Props {
  book: Book;
}

export default function EditBook({ book }: Props) {
  const cld = cloudinaryFnc();

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      newPhotos: [],
      title: book?.title,
      author: book?.author,
      published: book?.published,
      description: book?.description,
      pages: book?.pages,
      language: book?.language,
      genres: book?.genres,
    },
  });

  const [marginTop, setMarginTop] = useState(0);
  const formRef = useRef<HTMLDivElement | null>(null);

  const appContext = useAppContext();
  const [loading, setLoading] = useState(false)
  const submitToCloudinary = useCloudinary();
  const { postData: addPhoto } = useMutationWithToken(ADD_PHOTO);
  const { postData: deletePhoto } = useMutationWithToken(DELETE_PHOTO);
  const { postData: editFields } = useMutationWithToken(EDIT_FIELDS);

  const submitEdit = async () => {
    try {
      setLoading(true)
      await Promise.all(
        getValues("newPhotos")!.map(async (photo: string | Blob) => {
          const formData = new FormData();
          formData.append("file", photo);
          formData.append("upload_preset", PRESET);
          formData.append("folder", FOLDER_NAME);
          const id = await submitToCloudinary(formData);
          const photoInput = {id: book?._id, photo: id}
          await addPhoto(photoInput);
        })
      );
      const input = {
        id: book?._id,
        title: getValues("title"),
        author: getValues("author"),
        description: getValues("description"),
        pages: getValues("pages"),
        language: getValues("language"),
        genres: getValues("genres"),
        published: getValues("published"),
      }
      await editFields(input);
      setLoading(false)
    } catch (error) {
      appContext.setError(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (errors.title) {
      appContext.setError(`Title error: ${errors.title.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.author) {
      appContext.setError(`Error: ${errors.author.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.published) {
      appContext.setError(`Published error: ${errors.published.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.pages){
      appContext.setError(`Pages error: ${errors.pages.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.genres) {
      appContext.setError(`Genres error: ${errors.genres.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.language) {
      appContext.setError(`Language error: ${errors.language.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.description) {
      appContext.setError(`Description error: ${errors.description.message}`);
      appContext.setOpenErrorAlert(true)
    } else if (errors.newPhotos) {
      appContext.setError(`Photos error: ${errors.newPhotos.message}`);
      appContext.setOpenErrorAlert(true)
    } else {
      appContext.clearErrorMessage();
    }

    const updateMarginTop = () => {
      if (formRef.current) {
        const formHeight = formRef.current.offsetHeight;
        const marginTopValue = (window.innerHeight + formHeight) / 3;
        setMarginTop(marginTopValue);
      }
    };

    updateMarginTop();

    const observer = new ResizeObserver(updateMarginTop);
    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [appContext, errors.author, errors.description, errors.genres, errors.language, errors.newPhotos, errors.pages, errors.published, errors.title]);
  return (
    <Card
      ref={formRef}
      className="form-wrapper edit-form"
      style={{ marginTop: `${marginTop}px` }}
    >
      <Box className="form-header">
        <Typography variant="h4">Edit {book?.title}</Typography>
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
                      <Checkbox checked={field.value!.indexOf(genre) > -1} />
                      <ListItemText primary={genre} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <Controller
            name="newPhotos"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                ADD ANOTHER PHOTO
                <VisuallyHiddenInput
                  type="file"
                  multiple
                  onChange={(e) =>
                    field.onChange([...field.value!, ...e.target.files!])
                  }
                />
              </Button>
            )}
          />
        </Box>
      </Box>
      <Box className="display-photos">
        {book?.photos &&
          book.photos.map((photo: string) => (
            <Box key={photo} className="photo-wrapper">
              <AdvancedImage
                cldImg={cld.image(photo).resize(fill().width(100).height(150))}
              />
              <Button variant='outlined' color="warning"  className="delete-photo-btn" sx={{width: '0.5rem'}} onClick={()=>deletePhoto({id: book._id, photo: photo})}><DeleteOutlineSharpIcon color='warning'/></Button>
            </Box>
          ))}
      </Box>
      {loading ? (
        <Button disabled>
          <CircularProgress />
        </Button>
      ) : (
        <Button type="submit" onClick={handleSubmit(submitEdit)} variant="outlined" color="info">
          SUBMIT EDIT
        </Button>
      )}
    </Card>
  );
}
