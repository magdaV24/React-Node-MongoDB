import { AdvancedImage } from "@cloudinary/react";
import { Modal, Box } from "@mui/material";
import { cloudinaryFnc } from "../../utils/cloudinaryFnc";

interface Props {
  open: boolean;
  onClose: () => void;
  photoURL: string;
}
export default function PhotoDisplay({ open, onClose, photoURL }: Props) {
  const cld = cloudinaryFnc();

  return (
    <Modal open={open} onClose={onClose} className="modal">
      <Box className="display-photo-wrapper" sx={{backgroundColor: "primary.light"}}>
        <AdvancedImage cldImg={cld.image(photoURL)} className="photo-component" />
      </Box>
    </Modal>
  );
}
