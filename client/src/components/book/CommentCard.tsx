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
import {
  // CHECK_LIKED_COMMENT,
  // COUNT_COMMENT_LIKES,
  // DELETE_COMMENT,
  FETCH_COMMENTS,
  // LIKE_COMMENT,
} from "../../api/urls";
// import Like from "./Like";
import { useQuery } from "react-query";
import fetchData from "../../functions/fetchData";
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

interface Props {
  book_id: string;
  user_id: string;
  content: string;
  date: string;
  id: string;
  username: string;
  avatar: string;
}

export default function CommentCard({
  user_id,
  book_id,
  content,
  date,
  id,
  username,
  avatar,
}: Props) {
  const format_date = date.substring(0, 10);
  const { currentUser, loading, error, message } = useContext(AuthContext);

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

  const delete_comment = useDeleteComment();

  const handleDelete = (e: unknown) => {
    (e as Event).preventDefault();
    try {
      delete_comment(id);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  // Fetching the children
  const [queryKey, setQueryKey] = useState("");
  const [queryFn, setQueryFn] = useState<Promise<unknown> | undefined>();
  const fetchChildren = () => fetchData(`${FETCH_COMMENTS}/${id}`);

  const {
    data,
    isLoading,
    error: childrenError,
    refetch,
  } = useQuery(queryKey, () => queryFn);

  const handleShowChildren = () => {
    if (showChildren === false) {
      setShowChildren(true);
      setQueryKey(`commentQuery${id}`);
      setQueryFn(fetchChildren);
      refetch();
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
            {(data as Comment[]) && (
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
                    {loading ? (
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
            {/* {currentUser && (
              <Like
                user_id={currentUser.id}
                object_id={id}
                book_id=""
                like_query={LIKE_COMMENT}
                check_query={`${CHECK_LIKED_COMMENT}/${id}/${user_id}`}
                count_query={`${COUNT_COMMENT_LIKES}/${id}`}
              />
            )} */}
          </Container>
        </CardActions>
        {isCommenting && <CommentForm parent_id={id} book_id={book_id} />}
      </Card>
      {isEditing && <CommentEditForm content={content} id={id} />}
      <Box sx={children_wrapper}>
        {showChildren && (
          <>
            {isLoading && (
              <>
                {data &&
                  (data as Comment[]).map((comment: Comment) => (
                    <CommentCard
                      user_id={comment.user_id}
                      content={comment.content}
                      date={comment.date}
                      id={comment.id}
                      username={comment.username}
                      avatar={comment.avatar}
                      book_id={comment.book_id}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </Box>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert message={error} />}
      {(childrenError as string) && (
        <ErrorAlert message={childrenError as string} />
      )}
    </Box>
  );
}
