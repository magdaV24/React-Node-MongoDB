import express from "express";
import { validate } from "../middleware/validate";
import {
  addComment,
  deleteComment,
  editComment,
  fetchComments,
} from "../database/controllers/CommentController";
import {
  addCommentValidationRules,
  deleteCommentValidationRules,
  editCommentValidationRules,
  fetchCommentsValidationRules,
} from "../middleware/validation/commentValidator";

const router = express.Router();

router.post("/addComment", addCommentValidationRules, validate, addComment);
router.get(
  "/fetchComments/:id",
  fetchCommentsValidationRules,
  validate,
  fetchComments
);
router.post(
  "/deleteComment",
  deleteCommentValidationRules,
  validate,
  deleteComment
);
router.post("/editComment", editCommentValidationRules, validate, editComment);

export default router;
