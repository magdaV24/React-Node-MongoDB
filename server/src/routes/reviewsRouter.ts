import express from "express";
import { validate } from "../middleware/validate";
import { addReview, fetchReviews, sortFinished, sortStars, editReview, deleteReview } from "../database/controllers/ReviewController";

const router = express.Router()

router.post("/addReview",validate, addReview);
router.get("/fetchReviews/:id",validate, fetchReviews) 
router.get("/sortFinished/:id/:finished",validate, sortFinished); 
router.get("/sortStars/:id/:stars",validate, sortStars);
router.post('/editReview',validate, editReview);
router.post('/editReview',validate, editReview);
router.post('/deleteReview',validate, deleteReview);

export default router