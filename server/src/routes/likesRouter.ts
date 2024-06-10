import express from "express";
import { likeObject, checkIfLiked, countLikes } from "../database/controllers/LikeController";
import { validate } from "../middleware/validate";

const router = express.Router()

router.post("/like",validate, likeObject); //gives a like to an object (review/comment)
router.get("/checkIfLiked/:userId/:objectId",validate, checkIfLiked); // checks if the user liked an object and returns a boolean;
router.get("/countLikes/:objectId",validate, countLikes); // return the umber of likes of a certain object;

export default router