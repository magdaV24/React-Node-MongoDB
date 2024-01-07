import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
import { Controller, useForm } from "react-hook-form";
import { GENRES_LIST } from "../../genres";
import useEditField from "../../hooks/mutations/useEditFieldMutation";
import { Book } from "../../types/Book";

interface Props {
  book: Book
}

const genres_list = GENRES_LIST;

export default function EditBookTable({
 book
}: Props) {
  const [genresArr, setGenresArr] = useState("");

  const set_genres = (genres: string[]) => {
    const array = genres.join(", ");
    return setGenresArr(array);
  };
  const [editing, setEditing] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const editingState = (i: number) => {
    const newEditing = [...editing];
    newEditing[i] = !newEditing[i];
    setEditing(newEditing);
  };

  // Editing a field

  const { control, handleSubmit, getValues } = useForm();
  useEffect(() => {
    set_genres(book?.genres);
  }, [book?.genres]);

  const {edit_field, editFieldLoading} = useEditField();

  const submit_edit = async (field: string, update: unknown, id: string) => {
    const data = {
      id: id,
      field: field,
      update: update,
    };
    console.log(data)
    try {
      await edit_field(data);
    } catch (error) {
     console.log(`Error: ${error}`)
    }
  };

  return (
    <TableContainer
      sx={{
        display: "flex",
        minHeight: "60vh",
        height: "fit-content",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell sx={{ width: "10%", backgroundColor: "secondary.dark" }}>
              Title:
            </TableCell>
            <TableCell
              sx={{ width: "90%", backgroundColor: "secondary.main" }}
              onDoubleClick={() => editingState(0)}
            >
              {editing[0] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <TextField
                        sx={{ width: "90%", backgroundColor: "secondary.main" }}
                        autoFocus
                        {...field}
                        defaultValue={book?.title}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />

                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("title", getValues("title"), book?._id)
                      )}
                      sx={{ height: "7vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                book?.title
              )}
            </TableCell>
          </TableRow>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell>Author:</TableCell>
            <TableCell onDoubleClick={() => editingState(1)}>
              {editing[1] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="author"
                    render={({ field }) => (
                      <TextField
                        autoFocus
                        {...field}
                        defaultValue={book?.author}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("author", getValues("author"), book?._id)
                      )}
                      sx={{ height: "7vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                book?.author
              )}
            </TableCell>
          </TableRow>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell>Published:</TableCell>
            <TableCell onDoubleClick={() => editingState(2)}>
              {editing[2] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="published"
                    render={({ field }) => (
                      <TextField
                        autoFocus
                        {...field}
                        defaultValue={book?.published}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("published", getValues("published"), book?._id)
                      )}
                      sx={{ height: "7vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                book?.published
              )}
            </TableCell>
          </TableRow>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell>Pages:</TableCell>
            <TableCell onDoubleClick={() => editingState(3)}>
              {editing[3] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="pages"
                    render={({ field }) => (
                      <TextField
                        autoFocus
                        type="number"
                        inputProps={{
                          min: 0,
                          step: 1,
                        }}
                        {...field}
                        defaultValue={book?.pages}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("pages", getValues("pages"), book?._id)
                      )}
                      sx={{ height: "7vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                book?.pages
              )}
            </TableCell>
          </TableRow>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell>Genres:</TableCell>
            <TableCell onDoubleClick={() => editingState(4)}>
              {editing[4] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="genres"
                    render={({ field }) => (
                      <Select
                        labelId="genres-label"
                        id="genres-id"
                        multiple
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        input={<OutlinedInput label="Genres" />}
                        renderValue={(selected) => selected.join(", ")}
                        defaultChecked={true}
                        defaultValue={book?.genres}
                      >
                        {genres_list.map((genre) => (
                          <MenuItem key={genre} value={genre}>
                            <Checkbox checked={field.value} />
                            <ListItemText primary={genre} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("genres", getValues("genres"), book?._id)
                      )}
                      sx={{ height: "7vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                genresArr
              )}
            </TableCell>
          </TableRow>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell>Language:</TableCell>
            <TableCell onDoubleClick={() => editingState(5)}>
              {editing[5] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="language"
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="language-select"
                        label="Language"
                        sx={{ width: "10vw" }}
                        defaultValue={book?.language}
                      >
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

                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("language", getValues("language"), book?._id)
                      )}
                      sx={{ height: "7vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                book?.language
              )}
            </TableCell>
          </TableRow>
          <TableRow sx={{ align: "left", backgroundColor: "secondary.dark" }}>
            <TableCell>Description:</TableCell>
            <TableCell onDoubleClick={() => editingState(6)}>
              {editing[6] ? (
                <Container
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <TextField
                        autoFocus
                        multiline
                        minRows={4}
                        {...field}
                        variant="standard"
                        sx={{ width: "100%" }}
                        defaultValue={book?.description}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {editFieldLoading ? (
                    <Box>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleSubmit(() =>
                        submit_edit("description", getValues("description"), book?._id)
                      )}
                      sx={{ height: "16vh" }}
                    >
                      <PublishIcon />
                    </Button>
                  )}
                </Container>
              ) : (
                book?.description
              )}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
}
