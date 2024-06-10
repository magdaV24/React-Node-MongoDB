import express from "express";
import { validate } from "../middleware/validate";
import { addComment, deleteComment, editComment, fetchComments } from "../database/controllers/CommentController";

const router = express.Router()

router.post("/addComment",validate, addComment); // adds a new comment;
router.get("/fetchComments/:id",validate, fetchComments); //fetches the comments by their parent_id;
router.post("/deleteComment",validate, deleteComment); // deletes the comment;
router.post("/editComment",validate, editComment); //edits the comment;

export default router