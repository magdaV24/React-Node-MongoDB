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
        sx={{color: 'primary.main'}}
      >
        <AutoStoriesSharpIcon />
      </IconButton>
      <Typography
        variant="h6"
        className="app-name"
        sx={{color: 'primary.main'}}
      >
        NovelNotes
      </Typography>
    </Box>
  );
}
