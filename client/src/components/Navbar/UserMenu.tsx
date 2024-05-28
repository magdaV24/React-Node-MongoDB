import { AdvancedImage } from "@cloudinary/react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { cloudinaryFnc } from "../../utils/cloudinaryFnc";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { User } from "../../types/User";
import { SetStateAction } from "react";

interface Props {
  user: User;
  handleOpenMenu: (event: {currentTarget: SetStateAction<null>;}) => void;
  handleCloseMenu: () => void;
  setOpenMenu: (input: boolean)=>void;
  setOpenBookForm: (input: boolean)=>void;
  anchorEl:null;
  logout: ()=>void;
}
export default function UserMenu({
  user,
  handleCloseMenu,
  handleOpenMenu,
  setOpenMenu,
  setOpenBookForm,
  anchorEl,
  logout
}: Props) {
  const cld = cloudinaryFnc();
  return (
    <Box className="review-card-header-two">
      <Button className="app-bar-btn" onClick={(event: {currentTarget: SetStateAction<null>;}) => handleOpenMenu(event)} color="primary">
        <Box className="app-bar-avatar app-bar-username">
          <AdvancedImage
            cldImg={cld.image(user!.avatar).resize(fill().width(50).height(50))}
          />
        </Box>
        {user!.username}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user!.role === "Admin" && (
          <MenuItem onClick={() => setOpenBookForm(true)}>Add Book</MenuItem>
        )}
        <MenuItem onClick={logout}>Log out</MenuItem>
        <MenuItem onClick={() => setOpenMenu(true)}>Your Books</MenuItem>
      </Menu>
    </Box>
  );
}
