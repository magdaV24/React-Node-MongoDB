import MyBackdrop from "@mui/material/Backdrop";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { CircularProgress } from "@mui/material";

export default function Backdrop() {
  const { openBackdrop, handleCloseBackdrop } = useContext(AuthContext);

  return (
    <>
      {openBackdrop && (
        <MyBackdrop
          open={openBackdrop}
          onClick={handleCloseBackdrop}
        >
          <CircularProgress color="inherit" />
        </MyBackdrop>
      )}
    </>
  );
}
