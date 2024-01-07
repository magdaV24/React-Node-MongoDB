import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import { useContext, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import useAddStatus, { StatusInput } from "../../hooks/mutations/useAddStatusMutation";
import useChangeStatus from "../../hooks/mutations/useChangeStatusMutation";
import useLabel from "../../hooks/queries/useLabel";
import { AuthContext } from "../../context/AuthContextProvider";

export default function ReadingStatus() {
  const [status, setStatus] = useState(""); // The status that is going to the database
  const { currentUser, book } = useContext(AuthContext)
  const user_id = currentUser!.id;
  const book_id = book!._id
  const { add_status, statusLoading } = useAddStatus();
  const { change_status, changeStatusLoading } = useChangeStatus();
  const authContext = useAuthContext();
  const [loading, setLoading] = useState(false);

  const { label } = useLabel(user_id, book_id);

  const handleStatus = async (e: unknown) => {
    (e as Event).preventDefault();
    authContext.setDisabled(true);
    const data: StatusInput = {
      status: status,
      user_id: user_id,
      book_id: book_id,
    };
    if (label === "None") {
      await add_status(data);
      setLoading(statusLoading);
    } else {
      await change_status(data);
      setLoading(changeStatusLoading);
    }
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
      {loading ? (
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
