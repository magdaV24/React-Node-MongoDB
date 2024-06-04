import { AdvancedImage } from "@cloudinary/react";
import { CardMedia, CardContent, Typography, Box, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { cloudinaryFnc } from "../../utils/cloudinaryFnc";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Book } from "../../types/Book";
import "../../styles/components/bookCard.css";
import useGetUser from "../../hooks/useGetUser";
import EditBook from "../../forms/EditBook";
import { useState } from "react";
import DeleteBook from "../../forms/DeleteBook";
import { useToken } from "../../hooks/useToken";
import { useAppContext } from "../../hooks/useAppContext";
import AdminButtons from "./AdminButtons";

interface Props {
  book: Book;
}
export default function BookCard({ book }: Props) {
  const cld = cloudinaryFnc();
  const appContext = useAppContext();
  const token = appContext.token;
  const setToken = appContext.setToken;
  const { getUserId } = useToken(setToken);
  const userId = getUserId(token);

  const currentUser = useGetUser(userId);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  function openEditForm() {
    setOpenEdit(true);
  }

  function openDeleteForm() {
    setOpenDelete(true);
  }
  return (
    <Box
      className="book-card-wrapper"
      sx={{ backgroundColor: "secondary.main" }}
    >
      <CardMedia title={`book-thumbnail-${book?._id}`}>
        <AdvancedImage
          cldImg={cld
            .image(book?.thumbnail)
            .resize(fill().width(150).height(250))}
        />
      </CardMedia>
      <CardContent>
        <Link to={`/${book?.title}`} className="link">
          {book?.title}
        </Link>
        <Typography variant="body2" color="text.secondary">
          {book?.author}
        </Typography>
        {currentUser?.role === "Admin" && (
          <AdminButtons
            openEditForm={openEditForm}
            openDeleteForm={openDeleteForm}
          />
        )}
      </CardContent>
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        className="modal"
      >
        <div>
          <EditBook book={book} />
        </div>
      </Modal>
      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        className="modal"
      >
        <div>
          <DeleteBook
            bookId={book?._id}
            close={() => setOpenDelete(false)}
            photos={book?.photos}
          />
        </div>
      </Modal>
    </Box>
  );
}
