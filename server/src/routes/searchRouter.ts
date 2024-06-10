import express from "express";
import { validate } from "../middleware/validate";
import { search } from "../database/controllers/BookController";

const router = express.Router()

router.post("/search",validate, search); 

export default router