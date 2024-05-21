import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import useQueryHook from "../hooks/useQueryHook";
import { CHECK_IF_LIKED, COUNT_LIKES, LIKE_OBJECT } from "../utils/urls";
import useGetUser from "../hooks/useGetUser";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import useMutationWithToken from "../hooks/useMutationWithToken";
import { useAppContext } from "../hooks/useAppContext";
import useQueryWithToken from "../hooks/useQueryWithToken";
import '../styles/components/likeButton.css'

interface Props {
  objectId: string;
  userId: string | null;
  bookId: string;
}

export default function Like({ objectId, userId, bookId }: Props) {
  const currentUser = useGetUser(userId);
  const queryName = `likeQuery/${objectId}`;
  const url = `${COUNT_LIKES}/${objectId}`;
  const { data: count } = useQueryHook(url, queryName);

  const queryNameTwo = `likedObject/${userId}/${objectId}`;
  const urlTwo = `${CHECK_IF_LIKED}/${userId}/${objectId}`;
  const { data: liked } = useQueryWithToken(urlTwo, queryNameTwo);

  const { postData, loading } = useMutationWithToken(LIKE_OBJECT, queryName);
  const appContext = useAppContext();
  const onSubmit = async () => {
    try {
      const input = {
        objectId: objectId,
        userId: userId,
        bookId: bookId,
      };
      await postData(input);
    } catch (error) {
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error while trying to submit your like: ${error}`);
    }
  };
  return (
    <>
      <Box className='like-button'
      >
        {loading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {currentUser && liked ? (
              <Button
                size="large"
                className="likeButton"
                onClick={onSubmit}
                sx={{ gap: 1 }}
              >
                <FavoriteSharpIcon />
                <Typography>{count}</Typography>
              </Button>
            ) : (
              <Button
                size="large"
                className="likeButton"
                onClick={onSubmit}
                sx={{ gap: 1 }}
              >
                <FavoriteBorderSharpIcon className="likeButton" />
                <Typography>{count}</Typography>
              </Button>
            )}
          </>
        )}
      </Box>
    </>
  );
}
