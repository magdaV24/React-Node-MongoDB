import { Container, Typography } from "@mui/material";
import { useState } from "react";
import { Review } from "../../types/Review";
import ReviewCard from "./ReviewCard";
import Sort from "./Sort";
import { useFetchReviews } from "../../hooks/queries/useFetchReviews";
import { useFetchByStars } from "../../hooks/queries/useFetchByStars";
import { useFetchByFinished } from "../../hooks/queries/useFetchByFinished";

interface Props {
  book_id: string;
}

export default function ReviewList({ book_id }: Props) {
  const [finished, setFinished] = useState("");
  const [stars, setStars] = useState("");

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
              user_id={review.user_id}
              content={review.content}
              date={review.date}
              stars={review.stars}
              finished={review.finished}
              review_id={review._id}
              avatar={review.avatar}
              username={review.username}
              book_id={book_id}
              spoilers={review.spoilers}
              key={review._id}
            />
          )
        )}
      </Container>
    </Container>
  );
}