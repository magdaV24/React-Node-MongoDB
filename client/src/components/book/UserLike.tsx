import {
  Container,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { useAuthContext } from "../../hooks/useAuthContext";
import useLike from "../../hooks/mutations/useLikeMutation";
import useFetchLikesCount from "../../hooks/queries/useFetchLikesCount";
import useIsLiked from "../../hooks/queries/useIsLiked";
interface Props {
  object_id: string;
  book_id: string;
}

export default function UserLike({ object_id, book_id }: Props) {
  const { currentUser } = useContext(AuthContext);
  const authContext = useAuthContext();
  const id = currentUser!.id;
  const input = {
    user_id: id,
    object_id: object_id,
    book_id: book_id,
  };

  // Give/Take the user's like;
  const {give_like, likeLoading} = useLike();
  const onSubmit = async () => {
    try {
      await give_like(input);
    } catch (error) {
      authContext.setError(`Error: ${error}`)
    }
  };

  // Count the likes of a comment/review

  const liked = useIsLiked(input);

  // Check wether of not a user liked an object

  const {count} = useFetchLikesCount(input);

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
        {likeLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {(currentUser && liked) ? (
              <Button size="large" className="likeButton" onClick={onSubmit} sx={{gap: 1}}>
                <FavoriteSharpIcon />
                <Typography>{count}</Typography>
              </Button>
            ) : (
              <Button size="large" className="likeButton" onClick={onSubmit} sx={{gap: 1}}>
                <FavoriteBorderSharpIcon className="likeButton" />
                  <Typography>{count}</Typography>
              </Button>
            )}
          </>
        )}
      </Container>
    </>
  );
}
