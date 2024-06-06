// React imports
import { useState, useEffect, SetStateAction } from "react";

// Cloudinary imports
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

// MUI imports
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Rating,
  Button,
  CardActions,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";

//Custom Hooks
import useGetUser from "../hooks/useGetUser";
import useQueryHook from "../hooks/useQueryHook";
import useMutationWithToken from "../hooks/useMutationWithToken";

// Types
import { Review } from "../types/Review";

// Context Management
import { useAppContext } from "../hooks/useAppContext";

// Forms
import EditReview from "../forms/EditReview";
import AddComment from "../forms/AddComment";

// Utils
import { cloudinaryFnc } from "../utils/cloudinaryFnc";
import { DELETE_REVIEW, FETCH_COMMENTS } from "../utils/urls";

// Custom Components
import CommentsList from "./CommentsList";
import Like from "./Like";

//Styles
import "../styles/components/reviewCard.css";

interface Props {
  review: Review;
  bookId: string;
  userId: string;
}
export default function ReviewCard({ review, bookId, userId }: Props) {
  const cld = cloudinaryFnc();

  const formattedDate = review?.date.substring(0, 10);
  const appContext = useAppContext();

  const [showSpoilers, setShowSpoilers] = useState(false);

  const currentUser = useGetUser(userId);
  const [hasFinished, setHasFinished] = useState("");

  // Open the modal that contains the editing form
  const [openEdit, setOpenEdit] = useState(false);
  const closeEdit = () => {
    setOpenEdit(false);
  };

  const [cancel, setCancel] = useState(false);
  let btn;

  if (cancel) {
    btn = "Cancel";
  } else {
    btn = "Reply";
  }
  //Deleting a review
  const { postData, loading } = useMutationWithToken(DELETE_REVIEW);
  const handleDelete = async (e: unknown) => {
    (e as Event).preventDefault();
    const input = {
      id: bookId,
      reviewId: review._id,
      stars: review?.stars,
    };
    try {
      await postData(input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  const [showComments, setShowComments] = useState(false);
  const [showBtn, setShowBtn] = useState("Show Replies");

  const handleShowComments = () => {
    if (showComments === false) {
      setShowBtn("Hide Replies");
      setShowComments(true);
    } else {
      setShowComments(false);
      setShowBtn("Show Replies");
    }
  };

  const [reply, setReply] = useState(false);

  const handleShowCommentForm = () => {
    setReply((prev) => !prev);
    setCancel((prev) => !prev);
  };

  // Fetching comments;

  const queryName = `commentsList`;
  const { data } = useQueryHook(
    `${FETCH_COMMENTS}/${review._id}`,
    queryName,
    true
  );

  // User menu

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event: { currentTarget: SetStateAction<null> }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (review?.finished === "Finished") {
      setHasFinished("Finished");
    }
    if (review?.finished === "DNF") {
      setHasFinished("(Did not finish)");
    }
  }, [appContext, review?.finished]);
  return (
    <Box className="review-card-wrapper">
      <Card sx={{ width: "100%", padding: 2 }}>
        <Box>
          <Box className="review-card-header">
            <Box className="review-card-header-one">
              <Box className="card-avatar">
                <AdvancedImage
                  cldImg={cld.image(review?.avatar).resize(fill().width(60))}
                />
              </Box>
              <Box className="card-header-box">
                <Typography
                  sx={{ fontSize: 16, mt: 0.5 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {review?.username}'s review:
                </Typography>

                <Typography
                  color="text.secondary"
                  className="comment-card-date"
                >
                  {formattedDate}
                </Typography>
              </Box>
            </Box>

            {currentUser?._id === review.userId && (
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
                  <MenuItem onClick={() => setOpenEdit((prev) => !prev)}>
                    <EditSharpIcon color="info" />
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Box>
        <Divider className="divider" />
        {openEdit ? (
          <EditReview
            review={review}
            userId={userId}
            cancel={closeEdit}
            bookId={bookId}
          />
        ) : (
          <>
            <CardContent sx={{ width: "100%" }}>
              <Box className="review-card-rating">
                <Rating
                  name="disabled"
                  value={review?.stars}
                  disabled
                  precision={0.25}
                />
                <Typography component="legend">{review?.stars}</Typography>
                <Typography>{hasFinished}</Typography>
              </Box>

              <Box className="review-card-content">
                {review?.spoilers ? (
                  <>
                    {showSpoilers ? (
                      <Typography variant="body2">{review?.content}</Typography>
                    ) : (
                      <Button onClick={() => setShowSpoilers(true)}>
                        THIS REVIEW CONTAINS SPOILERS. CLICK HERE TO SHOW ITS
                        CONTENT
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography variant="body2">{review?.content}</Typography>
                )}
              </Box>
            </CardContent>
            <Divider className="divider" />
            <CardActions>
              <Box className="review-card-buttons-wrapper">
                <Box className="review-card-buttons-col-one">
                  {currentUser && (
                    <Button
                      size="large"
                      onClick={handleShowCommentForm}
                      variant="outlined"
                    >
                      {btn}
                    </Button>
                  )}

                  {data && (
                    <Button
                      size="large"
                      onClick={handleShowComments}
                      variant="outlined"
                    >
                      {showBtn}
                    </Button>
                  )}
                </Box>
                <Like objectId={review._id} userId={userId} bookId={bookId} />
              </Box>
            </CardActions>
            {reply && (
              <AddComment
                parentId={review?._id}
                userId={currentUser?._id}
                bookId={bookId}
                close={handleShowCommentForm}
              />
            )}
          </>
        )}
      </Card>
      {!openEdit && (
        <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
          {showComments && (
            <>
              {data && <CommentsList data={data} userId={currentUser?._id} />}
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
