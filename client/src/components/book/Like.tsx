import { Container, Button, Typography } from "@mui/material";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import { useMutation, useQuery } from "react-query";
import fetchData from "../../functions/fetchData";
import postData from "../../functions/postData";
interface Props {
  user_id: string;
  object_id: string;
  book_id: string;
  like_query: string;
  check_query: string;
  count_query: string;
}

export default function Like({
  user_id,
  object_id,
  book_id,
  like_query,
  check_query,
  count_query,
}: Props) {
  // Give/Take the user's like;
  const like_mutation = useMutation(async (input: unknown) => {
    try {
      return await postData(like_query, input);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  });

  // Count the likes of a comment/review

  const {
    data: likes,
    isLoading,
    error,
  } = useQuery(`likeQuery/${object_id}`, () => fetchData(count_query));

  const handleLike = (e: unknown) => {
    (e as Event).preventDefault();
    let input = {};
    if (book_id === "") {
      input = {
        user_id: user_id,
        object_id: object_id,
      };
    } else {
      input = {
        user_id: user_id,
        object_id: object_id,
        book_id: book_id,
      };
    }
    like_mutation.mutate(input);
  };

  // Check wether of not a user likes an object

  const {
    data: liked,
    isLoading: likedLoading,
    error: likedError,
  } = useQuery(`likedQuery/${object_id}`, () => fetchData(check_query));

  if (likedLoading) return <p>Loading...</p>;
  if (likedError) return <p>Error</p>;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      <Container
        sx={{
          width: "10%",
          display: "flex",
          gap: 1.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {liked ? (
          <Button size="large" className="likeButton" onClick={handleLike}>
            <FavoriteSharpIcon color="success" />
          </Button>
        ) : (
          <Button size="large" className="likeButton" onClick={handleLike}>
            <FavoriteBorderSharpIcon className="likeButton" />{" "}
            {likes ? (
              <Typography>{likes}</Typography>
            ) : (
              <Typography>0</Typography>
            )}
          </Button>
        )}
      </Container>
    </>
  );
}
