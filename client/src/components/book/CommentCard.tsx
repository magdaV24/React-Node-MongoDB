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
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { Comment } from "../../types/Comment";
import CommentForm from "../../forms/CommentForm";
import CommentEditForm from "../../forms/edit_objects/CommentEditForm";
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
import UserLike from "./UserLike";
import useFetchComments from "../../hooks/queries/useFetchComments";
import useDeleteComment from "../../hooks/mutations/useDeleteCommentMutation";

interface Props {
  comment: Comment;
  parent_id: string;
}

export default function CommentCard({
  comment
}: Props) {
  const format_date = comment?.date.substring(0, 10);
  const { currentUser } = useContext(AuthContext);

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
      id: comment?._id,
      parent_id: comment?.parent_id,
    };
    try {
      delete_comment(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  // Fetching the children

  const { comments } = useFetchComments(comment?._id);

  const handleShowChildren = () => {
    if (showChildren === false) {
      setShowChildren(true);
      setShowBtn("Hide Replies");
    } else {
      setShowChildren(false);
      setShowBtn("Show Replies");
    }
  };
  return (
    <Box sx={comment_card_wrapper}>
      <Card sx={{ width: "100%", padding: 0.5 }}>
        <CardContent sx={{ width: "100%" }}>
          <Container sx={comment_card_header_wrapper}>
            <Container sx={comment_card_header}>
              <Avatar alt="Avatar">
                <AdvancedImage
                  cldImg={cld.image(comment?.avatar).resize(fill().width(50).height(50))}
                />
              </Avatar>
              <Typography
                sx={{ fontSize: 16, mt: 0.5 }}
                color="text.secondary"
                gutterBottom
              >
                {comment?.username}'s comment:
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
            {comment?.content}
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
                {currentUser.id === comment?.user_id && (
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
                {currentUser.id === comment?.user_id && (
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
            {currentUser && <UserLike object_id={comment?._id} book_id={comment?.book_id} />}
          </Container>
        </CardActions>
        {isCommenting && <CommentForm parent_id={comment?._id} />}
      </Card>
      {isEditing && <CommentEditForm comment={comment} />}
      <Box sx={children_wrapper}>
        {showChildren && (
          <>
            {comments &&
              (comments as Comment[]).map((comment: Comment) => (
                <CommentCard
                  comment={comment}
                  parent_id={comment?._id}
                />
              ))}
          </>
        )}
      </Box>
    </Box>
  );
}
