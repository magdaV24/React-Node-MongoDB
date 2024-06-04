import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import { useState } from "react";
import useQueryWithToken from "../hooks/useQueryWithToken";
import {
  ADD_READING_STATUS,
  CHANGE_READING_STATUS,
  FIND_READING_STATUS,
} from "../utils/urls";
import useMutationWithToken from "../hooks/useMutationWithToken";

interface Props {
  userId: string;
  bookId: string;
}

export default function ReadingStatus({ userId, bookId }: Props) {
  const [status, setStatus] = useState(""); // The status that is going to the database

  const [loading, setLoading] = useState(false);
  const queryName = `readingStatus/${userId}/${bookId}`;
  const { data: label } = useQueryWithToken(
    `${FIND_READING_STATUS}/${userId}/${bookId}`,
    queryName
  );

  const { postData: addReadingStatus, loading: addStatusLoading } =
    useMutationWithToken(ADD_READING_STATUS);
  const { postData: changeReadingStatus, loading: changeStatusLoading } =
    useMutationWithToken(CHANGE_READING_STATUS);
  const handleStatus = async (e: unknown) => {
    (e as Event).preventDefault();
    const input = {
      status: status,
      userId: userId,
      bookId: bookId,
    };
    if (label === "None") {
      await addReadingStatus(input).then((res) => setStatus(res));
      setLoading(addStatusLoading);
    } else {
      await changeReadingStatus(input).then((res) => setStatus(res));
      setLoading(changeStatusLoading);
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} title="Reading Status">
      {label && <InputLabel id="label">{label}</InputLabel>}
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        label="Reading"
        value={status}
        sx={{ mr: 6, width: "11vw" }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem
          value={"Want to read"}
          onClick={() => setStatus("Want to read")}
        >
          Want to read
        </MenuItem>
        <MenuItem
          value={"Currently reading"}
          onClick={() => setStatus("Currently reading")}
        >
          Currently reading
        </MenuItem>
        <MenuItem value={"Read"} onClick={() => setStatus("Read")}>
          Read
        </MenuItem>
      </Select>
      {loading ? (
        <Button
          type="submit"
          sx={{
            width: "1vw",
            position: "absolute",
            left: "11.3vw",
            height: "7vh",
          }}
          disabled
        >
          <CircularProgress />{" "}
        </Button>
      ) : (
        <Button
          type="submit"
          sx={{
            width: "1vw",
            position: "absolute",
            left: "11.3vw",
            height: "7vh",
          }}
          onClick={handleStatus}
          variant="outlined"
          size="small"
        >
          <CheckBoxSharpIcon />
        </Button>
      )}
    </FormControl>
  );
}
