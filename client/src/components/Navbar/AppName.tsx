import { Box, IconButton, Typography } from "@mui/material";
import AutoStoriesSharpIcon from "@mui/icons-material/AutoStoriesSharp";
import '../../styles/components/navbar.css'

export default function AppName() {
  return (
    <Box className='app-title-wrapper'>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        className="app-title-icon"
        href="/"
      >
        <AutoStoriesSharpIcon />
      </IconButton>
      <Typography
        variant="h6"
        component="div"
        className="app-name"
      >
        NovelNotes
      </Typography>
    </Box>
  );
}
