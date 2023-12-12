import { Container, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { FETCH_REVIEWS, SHOW_FINISHED, SHOW_STARS } from "../../api/urls";
import fetchData from "../../functions/fetchData";
import { Review } from "../../types/Review";
import ReviewCard from "./ReviewCard";
import Sort from "./Sort";

interface Props{
    book_id: string
}

export default function ReviewList({book_id}: Props){
    const fetchAllReviews = () => fetchData(`${FETCH_REVIEWS}/${book_id}`);
    const fetchByFinished = (finished: string) =>
      fetchData(`${SHOW_FINISHED}/${book_id}/${finished}`);
    const fetchByStars = (stars: string) =>
      fetchData(`${SHOW_STARS}/${book_id}/${stars}`);
  
    const [queryKey, setQueryKey] = useState("showAllReviews");
    const [queryFn, setQueryFn] = useState(fetchAllReviews);
  
    const {
      data,
      isLoading: reviewsLoading,
      error: reviewsError,
      refetch,
    } = useQuery(queryKey, () => queryFn);
  
    const show_all = () => {
      setQueryKey("showAllReviews");
      setQueryFn(fetchAllReviews);
      refetch();
    };
  
    const show_finished = (finished: string) => {
      setQueryKey(finished);
      setQueryFn(() => fetchByFinished(finished));
      refetch();
    };
  
    const show_stars = (stars: string) => {
      setQueryKey(stars);
      setQueryFn(() => fetchByStars(stars));
      refetch();
    };
  
    return(
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
                {!data && <p>No data yet.</p>}
                {data && data.map((review: Review) => (
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
                ))}
                {reviewsLoading && <CircularProgress />}
                {reviewsError && <p>An error has occurred!</p>}
              </Container>
            </Container>
    )
}