// React imports
import { SetStateAction, useState } from "react";

// MUI imports
import {
  Card,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Cloudinary imports
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import AddComment from "../forms/AddComment";
import { Comment } from "../types/Comment";
import useGetUser from "../hooks/useGetUser";
import useQueryHook from "../hooks/useQueryHook";

// Utils
import { DELETE_COMMENT, FETCH_COMMENTS } from "../utils/urls";
import { cloudinaryFnc } from "../utils/cloudinaryFnc";

// Custom components
import CommentsList from "./CommentsList";
import Like from "./Like";

// Custom hooks
import useMutationWithToken from "../hooks/useMutationWithToken";

// Forms
import EditComment from "../forms/EditComment";

// Styles
import "../styles/components/commentCard.css";

interface Props {
  comment: Comment;
  userId: string | undefined;
}

export default function CommentCard({ comment, userId }: Props) {
  const currentUser = useGetUser(userId!);
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

  const { data } = useQueryHook(
    `${FETCH_COMMENTS}/${comment._id}`,
    queryName,
    true
  );

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
      <Card sx={{ width: "99%", padding: 1 }}>
        <Box>
          <Box className="comment-card-header">
            <Box className="comment-card-header-user">
              <Box className="card-avatar">
                <AdvancedImage
                  cldImg={cld.image(comment?.avatar).resize(fill().width(60))}
                />
              </Box>
              <Box className="card-header-box">
                <Typography
                  sx={{ fontSize: 16, mt: 0.5 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {comment?.username}'s comment:
                </Typography>

                <Typography
                  color="text.secondary"
                  className="comment-card-date"
                >
                  {formatDate}
                </Typography>
              </Box>
            </Box>

            <Box className="review-card-header-two">
              <Button onClick={handleOpenMenu as unknown as React.MouseEventHandler<HTMLButtonElement>}>
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
