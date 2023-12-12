import { AdvancedImage } from "@cloudinary/react";
import { Typography, Box, Card, CardContent, Container, Avatar, Divider, Rating, Button, CardActions, CircularProgress } from "@mui/material";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { DELETE_REVIEW, FETCH_COMMENTS, COUNT_REVIEW_LIKES, LIKE_REVIEW, CHECK_LIKED_REVIEW } from "../../api/urls";
import { AuthContext } from "../../context/AuthContextProvider";
import CommentForm from "../../forms/CommentForm";
import Login from "../../forms/Login";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import fetchData from "../../functions/fetchData";
import postData from "../../functions/postData";
import CommentCard from "./CommentCard";
import Like from "./Like";
import { Comment } from "../../types/Comment";

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
  console.log(review_id)
  const format_date = date.substring(0, 10);

  const [showSpoilers, setShowSpoilers] = useState(false);

  const { currentUser, book } = useContext(AuthContext);
  let has_finished;

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

  if (finished === "Finished") {
    has_finished = "(Finished)";
  } else {
    has_finished = "(Did not finish)";
  }
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

  const delete_mutation = useMutation(async (input: unknown) => {
    try {
      return await postData(DELETE_REVIEW, input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  });

  const handleDelete = (e: unknown) => {
    (e as Event).preventDefault();
    const input = {
      id: book.id,
      review_id: review_id,
      stars: stars,
    };
    delete_mutation.mutate(input);
  };

  const [showComments, setShowComments] = useState(false);
  const [showBtn, setShowBtn] = useState("Show Replies");
  const [queryKey, setQueryKey] = useState("");
  const [queryFn, setQueryFn] = useState<Promise<unknown> | undefined>();
  const fetchComments = () => fetchData(`${FETCH_COMMENTS}/${review_id}`);

  const { data, isLoading, error, refetch } = useQuery(queryKey, () => queryFn);

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
  if (error) return <Typography>An error has occurred.</Typography>;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 5,
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <Card sx={{ width: "100%", padding: 2 }}>
        <CardContent sx={{ width: "100%" }}>
          <Container
            sx={{
              display: "flex",
              width: "100%",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                height: "10vh",
                width: "90%",
                padding: 0,
                ml: -5,
              }}
            >
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
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
              height: "10vh",
              width: "100%",
              ml: -0.5,
            }}
          >
            <Rating name="disabled" value={stars} disabled precision={0.25} />
            <Typography component="legend">{stars}</Typography>
            <Typography>{has_finished}</Typography>
          </Container>

          {!spoilers && (
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
                minHeight: "5vh",
                height: "fit-content",
                padding: 3,
                mt: -4,
              }}
            >
              {content}
            </Typography>
          )}
          {spoilers && (
            <>
              {showSpoilers ? (
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    minHeight: "5vh",
                    height: "fit-content",
                    padding: 3,
                    mt: -4,
                  }}
                >
                  {content}
                </Typography>
              ) : (
                <Button onClick={() => setShowSpoilers(true)}>
                  THIS REVIEW CONTAINS SPOILERS. CLICK HERE TO SHOW ITS CONTENT
                </Button>
              )}
            </>
          )}
          <Divider />
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Container
            sx={{
              width: "90%",
              display: "flex",
              justifyContent: "flex-start",
              gap: 1,
            }}
          >
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
                  <Button
                    variant="outlined"
                    onClick={handleDelete}
                    sx={{ ml: 1 }}
                    color="warning"
                  >
                    DELETE
                  </Button>
                )}
                {currentUser.id === user_id && (
                  <Button
                    variant="outlined"
                    onClick={() => setOpenEdit(true)}
                    sx={{ ml: 1 }}
                    color="info"
                  >
                    Edit
                  </Button>
                )}
              </>
            )}
          </Container>
          <Container
            sx={{
              width: "10%",
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentUser &&
              <Like
                user_id={currentUser.id}
                object_id={review_id}
                book_id={book_id}
                count_query={`${COUNT_REVIEW_LIKES}/${review_id}/${book_id}`}
                like_query={LIKE_REVIEW}
                check_query={`${CHECK_LIKED_REVIEW}/${review_id}/${user_id}/${book_id}`}
              />
            }
          </Container>
        </CardActions>
        {isCommenting && (
          <CommentForm parent_id={review_id} book_id={book_id} />
        )}
        {/* <ReviewEditForm
          content={content}
          id={review_id}
          stars={stars}
          finished={finished}
          book_id={book_id}
          open={openEdit}
          close={closeEdit}
        /> */}
      </Card>
      <Box
        sx={{
          width: "98%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
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
    </Box>
  );
}
