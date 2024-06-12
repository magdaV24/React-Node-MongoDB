import express from "express";
import { validate } from "../middleware/validate";
import {
  addReview,
  fetchReviews,
  sortFinished,
  sortStars,
  editReview,
  deleteReview,
} from "../database/controllers/ReviewController";
import {
  addReviewValidationRules,
  deleteReviewValidationRules,
  editReviewValidationRules,
  fetchReviewsValidationRules,
  sortFinishedValidationRules,
  sortStarsValidationRules,
} from "../middleware/validation/reviewValidator";

const router = express.Router();

router.post("/addReview", addReviewValidationRules, validate, addReview);
router.get(
  "/fetchReviews/:id",
  fetchReviewsValidationRules,
  validate,
  fetchReviews
);
router.get(
  "/sortFinished/:id/:finished",
  sortFinishedValidationRules,
  validate,
  sortFinished
);
router.get(
  "/sortStars/:id/:stars",
  sortStarsValidationRules,
  validate,
  sortStars
);
router.post("/editReview", editReviewValidationRules, validate, editReview);
router.post(
  "/deleteReview",
  deleteReviewValidationRules,
  validate,
  deleteReview
);

export default router;
