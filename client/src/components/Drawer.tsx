import { Box, SwipeableDrawer, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Shelf from "./Shelf";
import { Book } from "../types/Book";
import '../styles/components/drawer.css'

interface Drawer {
  isOpen: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  userId: string | null;
  read: Book[];
  currentlyReading: Book[];
  wantToRead: Book[];
}

export default function Drawer({
  isOpen,
  handleClose,
  handleOpen,
  currentlyReading,
  wantToRead,
  read
}: Drawer) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
      <Shelf index={0} value={value} data={currentlyReading} />
      <Shelf index={1} value={value} data={wantToRead} />
      <Shelf index={2} value={value} data={read} />
    </SwipeableDrawer>
  );
}
