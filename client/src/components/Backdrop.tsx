import MyBackdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
import { useAppContext } from "../hooks/useAppContext";

export default function Backdrop() {
 const appContext = useAppContext();

  return (
    <>
      {appContext.openBackdrop && (
        <MyBackdrop
          open={appContext.openBackdrop}
          onClick={appContext.handleCloseBackdrop}
        >
          <CircularProgress color="info" />
        </MyBackdrop>
      )}
    </>
  );
}
