import {
  Box,
  CircularProgress,
  SwipeableDrawer,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { Book } from "../../types/Book";
import DrawerCard from "./DrawerCard";
import { useFetchByStatus } from "../../hooks/queries/useFetchByStatus";
import ErrorAlert from "../global/ErrorAlert";

interface Drawer {
  isOpen: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



export default function Drawer({ isOpen, handleClose, handleOpen }: Drawer) {
  // const [books, setBooks] = useState<Book[]>([])
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { currentUser, error, loading } = useContext(AuthContext);

  const user_id = currentUser.id;

  const { data: currently_reading } = useFetchByStatus(
    user_id,
    "currently_reading"
  );
  const { data: want_to_read } = useFetchByStatus(user_id, "want_to_read");
  const { data: read } = useFetchByStatus(user_id, "read");

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Currently Reading" {...a11yProps(0)} />
          <Tab label="Want to Read" {...a11yProps(1)} />
          <Tab label="Read" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel index={0} value={value}>
        {(currently_reading as Book[]) ? (
          (currently_reading as Book[]).map((book: Book) => (
            <DrawerCard
              key={book._id}
              title={book.title}
              author={book.author}
              photo={
                book.photos.length > 0
                  ? (book.photos[0] as unknown as string)
                  : ""
              }
            />
          ))
        ) : (
          <Typography>This shelf is empty!</Typography>
        )}
      </CustomTabPanel>
      <CustomTabPanel index={1} value={value}>
        {(want_to_read as Book[]) ? (
          (want_to_read as Book[]).map((book: Book) => (
            <DrawerCard
              key={book._id}
              title={book.title}
              author={book.author}
              photo={
                book.photos.length > 0
                  ? (book.photos[0] as unknown as string)
                  : ""
              }
            />
          ))
        ) : (
          <Typography>This shelf is empty!</Typography>
        )}
      </CustomTabPanel>
      <CustomTabPanel index={2} value={value}>
        {(read as Book[]) ? (
          (read as Book[]).map((book: Book) => (
            <DrawerCard
              key={book._id}
              title={book.title}
              author={book.author}
              photo={
                book.photos.length > 0
                  ? (book.photos[0] as unknown as string)
                  : ""
              }
            />
          ))
        ) : (
          <Typography>This shelf is empty!</Typography>
        )}
      </CustomTabPanel>
      {error && <ErrorAlert />}
      {loading && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </SwipeableDrawer>
  );
}
