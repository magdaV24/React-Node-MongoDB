import express from "express";
import {
  addBook,
  fetchBooks,
  fetchBook,
  addPhoto,
  deletePhoto,
  editBook,
  deleteBook,
} from "../database/controllers/BookController";
import { validate } from "../middleware/validate";
import {
  addBookValidationRules,
  handlePhotoValidationRules,
  deleteBookValidationRules,
  editBookValidationRules,
  fetchBookValidationRules,
} from "../middleware/validation/bookValidator";

const router = express.Router();

router.post("/addBook", addBookValidationRules, validate, addBook);
router.get("/fetchBooks", fetchBooks);
router.get("/fetchBook/:title", fetchBookValidationRules, validate, fetchBook);
router.post("/addPhoto", handlePhotoValidationRules, validate, addPhoto);
router.post("/deletePhoto", handlePhotoValidationRules, validate, deletePhoto);
router.post("/editBook", editBookValidationRules, validate, editBook);
router.post("/deleteBook", deleteBookValidationRules, validate, deleteBook);

export default router;
