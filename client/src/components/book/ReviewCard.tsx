import { AdvancedImage } from "@cloudinary/react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Container,
  Avatar,
  Divider,
  Rating,
  Button,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { FETCH_COMMENTS } from "../../api/urls";
import { AuthContext } from "../../context/AuthContextProvider";
import CommentForm from "../../forms/CommentForm";
import Login from "../../forms/Login";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import fetchData from "../../functions/fetchData";
import CommentCard from "./CommentCard";
import Like from "./Like";
import { Comment } from "../../types/Comment";
import {
  body_wrapper,
  button_box,
  card_actions,
  comments_wrapper,
  content_box,
  header,
  header_wrapper,
  like_box,
  review_card_wrapper,
} from "../../styles/reviewCard";
import ReviewEditForm from "../../forms/edit_objects/ReviewEditForm";
import useDeleteReview from "../../hooks/useDeleteReview";
import ErrorAlert from "../global/ErrorAlert";
import SuccessAlert from "../global/SuccessAlert";

interface Props {
  user_id: string;
  content: string;
  date: string;
  stars: number;
  finished: string;
  review_id: string;
  avatar: string;
  username: string;
  book_id: string;
  spoilers: boolean;
}
export default function ReviewCard({
  user_id,
  content,
  date,
  stars,
  finished,
  review_id,
  avatar,
  username,
  book_id,
  spoilers,
}: Props) {
  const { error, message, loading } = useContext(AuthContext);
  const format_date = date.substring(0, 10);

  const [showSpoilers, setShowSpoilers] = useState(false);

  const { currentUser, book } = useContext(AuthContext);
  const [hasFinished, setHasFinished] = useState('')

  // Open the modal that contains the login form
  const [openLogin, setOpenLogin] = useState(false);
  const closeLogin = () => {
    setOpenLogin(false);
  };

  // Open the modal that contains the editing form
  const [openEdit, setOpenEdit] = useState(false);
  const closeEdit = () => {
    setOpenEdit(false);
  };

  const cld = cloudinaryFnc();
  const [isCommenting, setIsCommenting] = useState(false);

  const [cancel, setCancel] = useState(false);
  let btn;

  if (cancel) {
    btn = "Cancel";
  } else {
    btn = "Reply";
  }

  const handleBtn = () => {
    setIsCommenting((prev) => !prev);
    setCancel((prev) => !prev);
  };

  const delete_review = useDeleteReview();
  const handleDelete = async (e: unknown) => {
    (e as Event).preventDefault();
    const input = {
      id: book._id,
      review_id: review_id,
      stars: stars,
    };
    try {
      await delete_review(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  const [showComments, setShowComments] = useState(false);
  const [showBtn, setShowBtn] = useState("Show Replies");
  const [queryKey, setQueryKey] = useState("");
  const [queryFn, setQueryFn] = useState<Promise<unknown> | undefined>();
  const fetchComments = () => fetchData(`${FETCH_COMMENTS}/${review_id}`);

  const {
    data,
    isLoading,
    error: sortError,
    refetch,
  } = useQuery(queryKey, () => queryFn);

  const handleShowComments = () => {
    if (showComments === false) {
      setShowBtn("Hide Replies");
      setShowComments(true);
      setQueryKey(`commentQuery${review_id}`);
      setQueryFn(fetchComments);
      refetch();
    } else {
      setShowComments(false);
      setShowBtn("Show Replies");
    }
  };
  useEffect(()=> {
    if (finished === "Finished") {
      setHasFinished("Finished");
    } 
    if (finished === "DNF") {
      setHasFinished("(Did not finish)");
    }
  
  },[finished])
  return (
    <Box sx={review_card_wrapper}>
      <Card sx={{ width: "100%", padding: 2 }}>
        <CardContent sx={{ width: "100%" }}>
          <Container sx={header_wrapper}>
            <Container sx={header}>
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
                {username}'s review:
              </Typography>
            </Container>

            <Typography
              sx={{ mb: 1.5, width: "15%", fontSize: 14 }}
              color="text.secondary"
            >
              {format_date}
            </Typography>
          </Container>
          <Divider />
          <Container sx={body_wrapper}>
            <Rating name="disabled" value={stars} disabled precision={0.25} />
            <Typography component="legend">{stars}</Typography>
            <Typography>{hasFinished}</Typography>
          </Container>

          {spoilers ? (
            <>
              {showSpoilers ? (
                <Typography variant="body2" sx={content_box}>
                  {content}
                </Typography>
              ) : (
                <Button onClick={() => setShowSpoilers(true)}>
                  THIS REVIEW CONTAINS SPOILERS. CLICK HERE TO SHOW ITS CONTENT
                </Button>
              )}
            </>
          ) : (
            <Typography variant="body2" sx={content_box}>
              {content}
            </Typography>
          )}
          <Divider />
        </CardContent>
        <CardActions sx={card_actions}>
          <Container sx={button_box}>
            <Button size="large" onClick={handleBtn} variant="outlined">
              {btn}
            </Button>

            <Button
              size="large"
              onClick={handleShowComments}
              variant="outlined"
            >
              {showBtn}
            </Button>
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
                    <Button
                      variant="outlined"
                      onClick={() => setOpenEdit(true)}
                      sx={{ ml: 1 }}
                      color="info"
                    >
                      Edit
                    </Button>
                  </>
                )}
              </>
            )}
          </Container>
          <Container sx={like_box}>
            {/* {currentUser &&
              <Like
                user_id={currentUser.id}
                object_id={review_id}
                book_id={book_id}
                count_query={`${COUNT_REVIEW_LIKES}/${review_id}/${book_id}`}
                like_query={LIKE_REVIEW}
                check_query={`${CHECK_LIKED_REVIEW}/${review_id}/${user_id}/${book_id}`}
              />
            } */}
          </Container>
        </CardActions>
        {isCommenting && (
          <CommentForm parent_id={review_id} book_id={book_id} />
        )}
        <ReviewEditForm
          content={content}
          id={review_id}
          stars={stars}
          finished={finished}
          book_id={book_id}
          open={openEdit}
          close={closeEdit}
        />
      </Card>
      <Box sx={comments_wrapper}>
        {showComments && (
          <>
            {data &&
              (data as Comment[]).map((comment: Comment) => (
                <CommentCard
                  book_id={comment.book_id}
                  user_id={comment.user_id}
                  content={comment.content}
                  date={comment.date}
                  id={comment.id}
                  username={comment.username}
                  avatar={comment.avatar}
                />
              ))}
          </>
        )}
        {isLoading && <CircularProgress />}
      </Box>
      <Login open={openLogin} handleClose={closeLogin} />

      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert message={error} />}
      {(sortError as string) && <ErrorAlert message={sortError as string} />}
    </Box>
  );
}
