import { Box, Typography } from "@mui/material";
import Sort from "./Sort";
import useQueryHook from "../hooks/useQueryHook";
import { FETCH_REVIEWS, SORT_FINISHED, SORT_STARS } from "../utils/urls";
import { useEffect, useState } from "react";
import { Review } from "../types/Review";
import ReviewCard from "./ReviewCard";

interface Props {
  bookId: string | null;
  userId: string | null;
}

export default function ReviewList({ bookId, userId }: Props) {
  const [finished, setFinished] = useState("");
  const [stars, setStars] = useState("");
  const queryKeyOne = `bookReviews/${bookId}`;
  const queryKeyTwo = `bookReviews/${bookId}/${finished}`;
  const queryKeyThree = `bookReviews/${bookId}/${stars}`;

  const queriesToInvalidate = [queryKeyOne, queryKeyTwo, queryKeyThree];
  const { data: allReviews } = useQueryHook(
    `${FETCH_REVIEWS}/${bookId}`,
    queryKeyOne,
    true,
    [queriesToInvalidate[1], queriesToInvalidate[2]]
  );

  const [reviews, setReviews] = useState<Review[]>(allReviews);

  const { data: reviewsByFinished } = useQueryHook(
    `${SORT_FINISHED}/${bookId}/${finished}`,
    queryKeyTwo,
    finished !== '',
    [queriesToInvalidate[0], queriesToInvalidate[2]]
  );
  const { data: reviewsByStars } = useQueryHook(
    `${SORT_STARS}/${bookId}/${stars}`,
    queryKeyThree,
    stars !== '',
    [queriesToInvalidate[0], queriesToInvalidate[1]]
  );

  useEffect(() => {
    if (finished) {
      setReviews(reviewsByFinished);
      setFinished(finished);
      setStars("");
    } else if (stars) {
      setReviews(reviewsByStars);
      setFinished("");
      setStars(stars);
    } else {
      setReviews(allReviews);
      setStars("");
      setFinished("");
    }
  }, [finished, stars, allReviews, reviewsByFinished, reviewsByStars]);

  const handleSortChange = (finished: string, stars: string) => {
    setFinished(finished);
    setStars(stars);
  };

  return (
    <Box className="review-list-wrapper">
      <Sort
        onSortChange={handleSortChange}
        setFinished={setFinished}
        setStars={setStars}
      />
      <Box className="reviews-wrapper">
        {!reviews ? (
          <Typography>No reviews yet!</Typography>
        ) : (
          reviews.map((review: Review) => (
            <ReviewCard
              review={review}
              key={review._id}
              bookId={bookId!}
              userId={userId!}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
