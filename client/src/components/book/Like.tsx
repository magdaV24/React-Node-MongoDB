import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import Login from "../../forms/Login";
import { useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import useFetchLikesCount from "../../hooks/queries/useFetchLikesCount";
import { LikeInput } from "../../interfaces/LikeInput";

interface Props {
  object_id: string;
}

export default function Like({ object_id }: Props) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setOpen(true);
  };
  const input: LikeInput = {
    object_id: object_id,
    user_id: "",
    book_id: "",
  };
  const { count } = useFetchLikesCount(input);
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
        <Button
          size="large"
          className="likeButton"
          onClick={handleClick}
          sx={{ gap: 1 }}
        >
          <FavoriteBorderSharpIcon className="likeButton" />{" "}
          {count ? (
            <Typography sx={{ color: "primary" }}>{count}</Typography>
          ) : (
            <Typography sx={{ color: "primary" }}>0</Typography>
          )}
        </Button>
      </Container>
      <Login open={open} handleClose={handleClose} />
    </>
  );
}
