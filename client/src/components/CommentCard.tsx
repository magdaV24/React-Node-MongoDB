import { AdvancedImage } from "@cloudinary/react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { cloudinaryFnc } from "../utils/cloudinaryFnc";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { SetStateAction, useState } from "react";
import AddComment from "../forms/AddComment";
import { Comment } from "../types/Comment";
import useGetUser from "../hooks/useGetUser";
import useQueryHook from "../hooks/useQueryHook";
import { DELETE_COMMENT, FETCH_COMMENTS } from "../utils/urls";
import CommentsList from "./CommentsList";
import "../styles/components/commentCard.css";
import Like from "./Like";
import useMutationWithToken from "../hooks/useMutationWithToken";
import EditComment from "../forms/EditComment";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Props {
  comment: Comment;
  userId: string | null;
}

export default function CommentCard({ comment, userId }: Props) {
  const currentUser = useGetUser(userId);
  const formatDate = comment?.date.substring(0, 10);

  const [isEditing, setIsEditing] = useState(false);
  const [reply, setReply] = useState(false);

  const cld = cloudinaryFnc();

  const [cancel, setCancel] = useState(false);
  let btn;
  if (cancel) {
    btn = "Cancel";
  } else {
    btn = "Reply";
  }
  const [showBtn, setShowBtn] = useState("Show Replies");
  const [showChildren, setShowChildren] = useState(false);

  const handleBtn = () => {
    setReply((prev) => !prev);
    setCancel((prev) => !prev);
  };
  // Deleting a comment

  const { postData, loading } = useMutationWithToken(DELETE_COMMENT);
  const handleDelete = async () => {
    const input = {
      id: comment?._id,
      parentId: comment?.parentId,
    };
    try {
      await postData(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  // User menu

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event: { currentTarget: SetStateAction<null> }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Fetching the children

  const queryName = `commentsList/${comment._id}`;

  const { data } = useQueryHook(`${FETCH_COMMENTS}/${comment._id}`, queryName);

  const handleShowChildren = () => {
    setShowChildren((prev) => !prev);
    setShowBtn(showChildren ? "Hide Replies" : "Show Replies");
  };
  return (
    <Box
      sx={{
        width: "99%",
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column",
        alignItems: "center",
        p: 0,
      }}
    >
      <Card sx={{ width: "99%", padding: 0.5 }}>
        <Box>
          <Box className="comment-card-header">
            <Box className="comment-card-header-user">
              <Avatar alt="Avatar">
                <AdvancedImage
                  cldImg={cld
                    .image(comment?.avatar)
                    .resize(fill().width(50).height(50))}
                />
              </Avatar>
              <Typography
                sx={{ fontSize: 16, mt: 0.5 }}
                color="text.secondary"
                gutterBottom
              >
                {comment?.username}'s comment:
              </Typography>
            </Box>

            <Box className="review-card-header-two">
              <Button onClick={handleOpenMenu}>
                <MoreVertIcon />
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
                <MenuItem onClick={handleDelete}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <DeleteOutlineSharpIcon color="error" />
                  )}
                </MenuItem>
                <MenuItem onClick={() => setIsEditing((prev) => !prev)}>
                  <EditSharpIcon color="info" />
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Typography color="text.secondary" className="comment-card-date">
            {formatDate}
          </Typography>
        </Box>
        <Divider className="divider" />
        {isEditing ? (
          <EditComment
            comment={comment}
            cancel={() => setIsEditing(false)}
            userId={currentUser?._id}
          />
        ) : (
          <>
            <CardContent sx={{ width: "100%" }}>
              <Typography variant="body2" className="comment-card-content">
                {comment?.content}
              </Typography>
              <Divider className="divider" />
            </CardContent>
            <CardActions>
              <Box className="comment-card-buttons-wrapper">
                <Box className="comment-card-buttons-col-one">
                  <Button size="large" onClick={handleBtn} variant="outlined">
                    {btn}
                  </Button>
                  {data && (
                    <Button
                      size="large"
                      onClick={handleShowChildren}
                      variant="outlined"
                    >
                      {showBtn}
                    </Button>
                  )}
                </Box>
              </Box>
              <Box>
                <Like
                  objectId={comment._id}
                  userId={currentUser?._id}
                  bookId={comment.bookId}
                />
              </Box>
            </CardActions>
          </>
        )}
        {reply && (
          <AddComment
            parentId={comment?._id}
            userId={currentUser?._id}
            bookId={comment.bookId}
            close={handleBtn}
          />
        )}
      </Card>
      <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
        {showChildren && (
          <>{data && <CommentsList data={data} userId={currentUser?._id} />}</>
        )}
      </Box>
    </Box>
  );
}
