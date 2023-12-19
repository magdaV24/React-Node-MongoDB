import { AdvancedImage } from "@cloudinary/react";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  CardActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { Comment } from "../../types/Comment";
import CommentForm from "../../forms/CommentForm";
import CommentEditForm from "../../forms/edit_objects/CommentEditForm";
import useDeleteComment from "../../hooks/useDeleteComment";
import ErrorAlert from "../global/ErrorAlert";
import SuccessAlert from "../global/SuccessAlert";
import {
  card_actions,
  card_actions_wrapper,
  children_wrapper,
  comment_card_header,
  comment_card_header_wrapper,
  comment_card_wrapper,
  content_wrapper,
  like_button_wrapper,
} from "../../styles/commentCard";
import { useFetchComments } from "../../hooks/queries/useFetchComments";
import { useAuthContext } from "../../hooks/useAuthContext";
import UserLike from "./UserLike";

interface Props {
  book_id: string;
  user_id: string;
  content: string;
  date: string;
  id: string;
  username: string;
  avatar: string;
  parent_id: string;
}

export default function CommentCard({
  user_id,
  book_id,
  content,
  date,
  id,
  username,
  avatar,
  parent_id,
}: Props) {
  const format_date = date.substring(0, 10);
  const { currentUser, error, message } = useContext(AuthContext);
  const authContext = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);

  const cld = cloudinaryFnc();
  const [isCommenting, setIsCommenting] = useState(false);

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
    setIsCommenting((prev) => !prev);
    setCancel((prev) => !prev);
  };
  // Deleting a comment

  const {delete_comment, deleteCommentLoading} = useDeleteComment();

  const handleDelete = (e: unknown) => {
    (e as Event).preventDefault();
    const input = {
      id: id,
      parent_id: parent_id,
    };
    try {
      delete_comment(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  // Fetching the children

  const { comments, error: childrenError } = useFetchComments(id);

  const handleShowChildren = () => {
    if (showChildren === false) {
      setShowChildren(true);
      setShowBtn("Hide Replies");
    } else {
      setShowChildren(false);
      setShowBtn("Show Replies");
    }
  };
  useEffect(() => {
    if (childrenError) authContext.setError(childrenError as string);
  });
  return (
    <Box sx={comment_card_wrapper}>
      <Card sx={{ width: "100%", padding: 0.5 }}>
        <CardContent sx={{ width: "100%" }}>
          <Container sx={comment_card_header_wrapper}>
            <Container sx={comment_card_header}>
              <Avatar alt="Avatar">
                <AdvancedImage
                  cldImg={cld.image(avatar).resize(fill().width(50).height(50))}
                />
              </Avatar>
              <Typography
                sx={{ fontSize: 16, mt: 0.5 }}
                color="text.secondary"
                gutterBottom
              >
                {username}'s comment:
              </Typography>
            </Container>

            <Typography
              sx={{ mb: 1.5, width: "10%", fontSize: 12 }}
              color="text.secondary"
            >
              {format_date}
            </Typography>
          </Container>
          <Divider />

          <Typography variant="body2" sx={content_wrapper}>
            {content}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions sx={card_actions_wrapper}>
          <Container sx={card_actions}>
            <Button size="large" onClick={handleBtn} variant="outlined">
              {btn}
            </Button>
            {(comments as Comment[]) && (
              <Button
                size="large"
                onClick={handleShowChildren}
                variant="outlined"
              >
                {showBtn}
              </Button>
            )}
            {currentUser && (
              <>
                {currentUser.id === user_id && (
                  <>
                    {deleteCommentLoading ? (
                      <Box>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={handleDelete}
                        sx={{ ml: 1 }}
                        color="warning"
                      >
                        DELETE
                      </Button>
                    )}
                  </>
                )}
                {currentUser.id === user_id && (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing((prev) => !prev)}
                    sx={{ ml: 1 }}
                    color="info"
                  >
                    Edit
                  </Button>
                )}
              </>
            )}
          </Container>
          <Container sx={like_button_wrapper}>
            {currentUser && <UserLike object_id={id} book_id={book_id} />}
          </Container>
        </CardActions>
        {isCommenting && <CommentForm parent_id={id} book_id={book_id} />}
      </Card>
      {isEditing && <CommentEditForm content={content} id={id} />}
      <Box sx={children_wrapper}>
        {showChildren && (
          <>
            {comments &&
              (comments as Comment[]).map((comment: Comment) => (
                <CommentCard
                  user_id={comment.user_id}
                  content={comment.content}
                  date={comment.date}
                  id={comment._id}
                  username={comment.username}
                  avatar={comment.avatar}
                  book_id={comment.book_id}
                  parent_id={id}
                />
              ))}
          </>
        )}
      </Box>
      {message && <SuccessAlert />}
      {error && <ErrorAlert />}
    </Box>
  );
}
