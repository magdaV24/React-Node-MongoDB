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
} from "@mui/material";
import { cloudinaryFnc } from "../../functions/cloudinaryFnc";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import {
  CHECK_LIKED_COMMENT,
  COUNT_COMMENT_LIKES,
  DELETE_COMMENT,
  FETCH_COMMENTS,
  LIKE_COMMENT,
} from "../../api/urls";
import Like from "./Like";
import { useMutation, useQuery } from "react-query";
import postData from "../../functions/postData";
import fetchData from "../../functions/fetchData";
import { Comment } from "../../types/Comment";
import CommentForm from "../../forms/CommentForm";

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

  const delete_mutation = useMutation(async (id: string) => {
    try {
      return await postData(DELETE_COMMENT, id);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  });

  const handleDelete = (e: unknown) => {
    (e as Event).preventDefault();
    delete_mutation.mutate(id);
  };

  // Fetching the children
  const [queryKey, setQueryKey] = useState("");
  const [queryFn, setQueryFn] = useState<Promise<unknown> | undefined>();
  const fetchChildren = () => fetchData(`${FETCH_COMMENTS}/${id}`);

  const { data, isLoading, error, refetch } = useQuery(queryKey, () => queryFn);

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
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 5,
        justifyContent: "flex-end",
        width: "inherit",
        m: 0,
      }}
    >
      <Card sx={{ width: "100%", padding: 0.5 }}>
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

          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: "75vw",
              minHeight: "5vh",
              height: "fit-content",
              padding: 3,
            }}
          >
            {content}
          </Typography>
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
            {(data as Comment[]) && (<Button
              size="large"
              onClick={handleShowChildren}
              variant="outlined"
            >
              {showBtn}
            </Button>)}
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
          <Container
            sx={{
              width: "10%",
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentUser && (
              <Like
                user_id={currentUser.id}
                object_id={id}
                book_id=""
                like_query={LIKE_COMMENT}
                check_query={`${CHECK_LIKED_COMMENT}/${id}/${user_id}`}
                count_query={`${COUNT_COMMENT_LIKES}/${id}`}
              />
            )}
          </Container>
        </CardActions>
        {isCommenting && <CommentForm parent_id={id} book_id={book_id} />}
      </Card>
      {/* {isEditing && <CommentEditForm content={content} id={id} />} */}
      <Box
        sx={{
          width: "98%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {showChildren && (
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
      </Box>
    </Box>
  );
}
