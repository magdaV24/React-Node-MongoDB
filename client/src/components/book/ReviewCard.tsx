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
import { AuthContext } from "../../context/AuthContextProvider";
import CommentForm from "../../forms/CommentForm";
import Login from "../../forms/Login";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import CommentCard from "./CommentCard";
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
import { useAuthContext } from "../../hooks/useAuthContext";
import UserLike from "./UserLike";
import Like from "./Like";
import useDeleteReview from "../../hooks/mutations/useDeleteReviewMutation";
import useFetchComments from "../../hooks/queries/useFetchComments";
import { Review } from "../../types/Review";

interface Props {
  review: Review;
  book_id: string
}
export default function ReviewCard({
review, book_id
}: Props) {
  const format_date = review?.date.substring(0, 10);

  const authContext = useAuthContext();

  const [showSpoilers, setShowSpoilers] = useState(false);

  const { currentUser, book } =
    useContext(AuthContext);
  const [hasFinished, setHasFinished] = useState("");

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

  const {delete_review, deleteReviewLoading} = useDeleteReview();
  const handleDelete = async (e: unknown) => {
    (e as Event).preventDefault();
    const input = {
      id: book!._id,
      review_id: review?._id,
      stars: review?.stars,
    };
    try {
      await delete_review(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  const [showComments, setShowComments] = useState(false);
  const [showBtn, setShowBtn] = useState("Show Replies");

  const { comments } = useFetchComments(review?._id);

  const handleShowComments = () => {
    if (showComments === false) {
      setShowBtn("Hide Replies");
      setShowComments(true);
    } else {
      setShowComments(false);
      setShowBtn("Show Replies");
    }
  };
  useEffect(() => {
    if (review?.finished === "Finished") {
      setHasFinished("Finished");
    }
    if (review?.finished === "DNF") {
      setHasFinished("(Did not finish)");
    }
  }, [authContext, review?.finished]);
  return (
    <Box sx={review_card_wrapper}>
      <Card sx={{ width: "100%", padding: 2 }}>
        <CardContent sx={{ width: "100%" }}>
          <Container sx={header_wrapper}>
            <Container sx={header}>
              <Avatar alt="Avatar">
                <AdvancedImage
                  cldImg={cld.image(review?.avatar).resize(fill().width(50).height(50))}
                />
              </Avatar>
              <Typography
                sx={{ fontSize: 16, mt: 0.5 }}
                color="text.secondary"
                gutterBottom
              >
                {review?.username}'s review:
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
            <Rating name="disabled" value={review?.stars} disabled precision={0.25} />
            <Typography component="legend">{review?.stars}</Typography>
            <Typography>{hasFinished}</Typography>
          </Container>

          {review?.spoilers ? (
            <>
              {showSpoilers ? (
                <Typography variant="body2" sx={content_box}>
                  {review?.content}
                </Typography>
              ) : (
                <Button onClick={() => setShowSpoilers(true)}>
                  THIS REVIEW CONTAINS SPOILERS. CLICK HERE TO SHOW ITS CONTENT
                </Button>
              )}
            </>
          ) : (
            <Typography variant="body2" sx={content_box}>
              {review?.content}
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
                {currentUser.id === review?.user_id && (
                  <>
                    {deleteReviewLoading ? (
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
            {currentUser && <UserLike object_id={review?._id} book_id={book_id} />}
            {!currentUser && <Like object_id={review?._id}/>}
          </Container>
        </CardActions>
        {isCommenting && (
          <CommentForm parent_id={review?._id} />
        )}
        <ReviewEditForm
          review={review}
          book_id={book_id}
          open={openEdit}
          close={closeEdit}
        />
      </Card>
      <Box sx={comments_wrapper}>
        {showComments && (
          <>
            {comments &&
              (comments as Comment[]).map((comment: Comment) => (
                <CommentCard
                  comment={comment}
                  parent_id={review?._id}
                />
              ))}
          </>
        )}
      </Box>
      <Login open={openLogin} handleClose={closeLogin} />
    </Box>
  );
}
