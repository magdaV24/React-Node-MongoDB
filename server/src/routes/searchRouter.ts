import express from "express";
import { validate } from "../middleware/validate";
import { search } from "../database/controllers/BookController";
import { searchValidationRules } from "../middleware/validation/serachValidator";

const router = express.Router()

router.post("/search", searchValidationRules,validate, search); 

export default router