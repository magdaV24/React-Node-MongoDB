import { Container, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Review } from "../../types/Review";
import ReviewCard from "./ReviewCard";
import Sort from "./Sort";
import { AuthContext } from "../../context/AuthContextProvider";
import useFetchByFinished from "../../hooks/queries/useFetchByFinished";
import useFetchByStars from "../../hooks/queries/useFetchByStars";
import useFetchReviews from "../../hooks/queries/useFetchReviews";

interface Props {
  book_id: string;
}

export default function ReviewList({ book_id }: Props) {
  const [finished, setFinished] = useState("");
  const [stars, setStars] = useState("");
  const { book } = useContext(AuthContext)

  const { reviews, refetch: refetchAll } = useFetchReviews(book_id, true);
  const { reviewsByStars, refetchByStars } = useFetchByStars(
    book_id,
    stars
  );
  const { reviewsByFinished, refetchByFinished } = useFetchByFinished(
    book_id,
    finished
  );

  const update_reviews = async () => {
    if (finished) {
      await refetchByFinished();
    } else if (stars) {
      await refetchByStars();
    } else {
      await refetchAll();
    }
  };
  const show_all = async () => {
    await update_reviews();
    setFinished('');
    setStars('');
  };

  const show_finished = async (finished: string) => {
    await update_reviews();
    setFinished(finished);
    setStars("");
  };

  const show_stars = async (stars: string) => {
    await update_reviews();
    setFinished("");
    setStars(stars);
  };

  return (
    <Container sx={{ display: "flex", width: "100%" }}>
      <Container
        sx={{
          display: "flex",
          width: "25%",
          height: "60vh",
          position: "sticky",
          p: 0,
        }}
      >
        <Sort
          show_finished={show_finished}
          show_stars={show_stars}
          show_all={show_all}
        />
      </Container>
      <Container
        sx={{
          width: "75%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          p: 0,
        }}
      >
        {(!reviews && !reviewsByFinished && !reviewsByStars) && <Typography>No reviews yet!</Typography>}
        {(finished ? reviewsByFinished : stars ? reviewsByStars : reviews)?.map(
          (review: Review) => (
            <ReviewCard
review={review}
key={review._id} book_id={book!._id}            />
          )
        )}
      </Container>
    </Container>
  );
}