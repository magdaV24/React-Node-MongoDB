import { Box, Typography } from "@mui/material";
import { Book } from "../types/Book";
import DrawerCard from "./DrawerCard";

interface Props{
    value: number;
    index: number;
    data: Book[];
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
      role="div"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Shelf({value, data, index}:Props) {
  if (data === undefined || data.length === 0) {
    return (
        <CustomTabPanel index={index} value={value}>
            <Typography>This shelf is empty!</Typography>
        </CustomTabPanel>
    );
}

return (
    <CustomTabPanel index={index} value={value}>
        {data.map((book) => (
            <DrawerCard
                key={book!._id}
                title={book!.title}
                author={book!.author}
                photo={book!.photos.length > 0 ? book!.photos[0] : ''}
            />
        ))}
    </CustomTabPanel>
  );
}
