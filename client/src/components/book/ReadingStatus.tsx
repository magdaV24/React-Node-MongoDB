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
import { useLabel } from "../../hooks/queries/useLabel";
import useAddStatus from "../../hooks/useAddStatus";
import useChangeStatus from "../../hooks/useChangeStatus";
import { useAuthContext } from "../../hooks/useAuthContext";

interface Props {
  user_id: string;
  book_id: string;
}

export default function ReadingStatus({ user_id, book_id }: Props) {
  const [status, setStatus] = useState(""); // The status that is going to the database

  const { add_status, statusLoading } = useAddStatus();
  const change_status = useChangeStatus();
  const authContext = useAuthContext();

  const {
    data: label,
    error: labelError,
    isLoading: labelLoading,
  } = useLabel(user_id, book_id);

  if (labelLoading) return <CircularProgress />;
  if (labelError) return <p>Error</p>;

  const handleStatus = async (e: unknown) => {
    (e as Event).preventDefault();
    authContext.setDisabled(true);
    const data = {
      status: status,
      id: user_id,
      book_id: book_id,
    };
    label === "None" ? await add_status(data) : await change_status(data);
    authContext.setDisabled(false);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
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
      {statusLoading ? (
        <Button
          type="submit"
          sx={{
            width: "1vw",
            position: "absolute",
            left: "11.3vw",
            height: "7vh",
          }}
          disabled={authContext.disabled}
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
          disabled={authContext.disabled}
        >
          <CheckBoxSharpIcon />
        </Button>
      )}
    </FormControl>
  );
}
