import { Box, Typography } from "@mui/material";
interface Props {
  description: string;
}
export default function BookDescription({ description }: Props) {
  return (
    <Box className="book-synopsis-wrapper">
      <Typography className="book-description">{description}</Typography>
    </Box>
  );
}
