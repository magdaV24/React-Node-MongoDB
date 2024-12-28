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
import React, { useEffect } from "react";

interface Props {
  objectId: string;
  userId: string | undefined;
  bookId: string;
}

export default function Like({ objectId, userId, bookId }: Props) {
  const currentUser = useGetUser(userId!);
  const appContext = useAppContext();
  const queryName = `likeQuery/${objectId}`;
  const url = `${COUNT_LIKES}/${objectId}`;
  const { data: count } = useQueryHook(url, queryName, true);

  const queryNameTwo = `likedObject/${userId}/${objectId}`;
  const urlTwo = `${CHECK_IF_LIKED}/${userId}/${objectId}`;
  const { data: liked } = useQueryWithToken(urlTwo, queryNameTwo);

  const { postData, loading } = useMutationWithToken(LIKE_OBJECT, queryName);

  const [likesCount, setLikesCount] = React.useState<number>(0);
  const [isLiked, setIsLiked] = React.useState<boolean>(false);

  const onSubmit = async () => {
    try {
      const input = {
        objectId: objectId,
        userId: userId,
        bookId: bookId,
      };
      await postData(input).then(() => {
        if(isLiked) {
          setLikesCount(prev => prev - 1);
          setIsLiked(prev => !prev);
        } else{
          setLikesCount(prev => prev + 1);
          setIsLiked(prev => !prev);
        }
      });
    } catch (error) {
      appContext.setOpenErrorAlert(true);
      appContext.setError(`Error while trying to submit your like: ${error}`);
    }
  };

  useEffect(() => {
    if (count) {
      setLikesCount(count);
    }
    if (liked) {
      setIsLiked(liked);
    }
  },[liked, count]);
  return (
    <>
        <Box className='like-button'>
            {loading ? (
                <Box>
                    <CircularProgress />
                </Box>
        ) : (
          <>
            {currentUser && isLiked ? (
              <Button
                size="large"
                className="likeButton"
                onClick={onSubmit}
                sx={{ gap: 1 }}
                disabled={loading}
              >
                <FavoriteSharpIcon />
                <Typography>{likesCount}</Typography>
              </Button>
            ) : (
              <Button
                size="large"
                className="likeButton"
                onClick={onSubmit}
                sx={{ gap: 1 }}
              >
                <FavoriteBorderSharpIcon className="likeButton" />
                <Typography>{likesCount}</Typography>
              </Button>
            )}
          </>
        )}
      </Box>
    </>
  );
}
