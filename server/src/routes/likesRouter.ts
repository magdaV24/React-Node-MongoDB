import express from "express";
import {
  likeObject,
  checkIfLiked,
  countLikes,
} from "../database/controllers/LikeController";
import { validate } from "../middleware/validate";
import {
  checkIfLikedValidationRules,
  countLikesValidationRules,
  likeObjectValidationRules,
} from "../middleware/validation/likeValidation";

const router = express.Router();

router.post("/like", likeObjectValidationRules, validate, likeObject);
router.get(
  "/checkIfLiked/:userId/:objectId",
  checkIfLikedValidationRules,
  validate,
  checkIfLiked
);
router.get(
  "/countLikes/:objectId",
  countLikesValidationRules,
  validate,
  countLikes
);

export default router;
