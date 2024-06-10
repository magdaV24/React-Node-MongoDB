import express from "express";
import {
  addBook,
  fetchBooks,
  fetchBook,
  addPhoto,
  deletePhoto,
  editFields,
  deleteBook,
} from "../database/controllers/BookController";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/addBook", validate, addBook);
router.get("/fetchBooks", validate, fetchBooks);
router.get("/fetchBook/:title", validate, fetchBook);
router.post("/addPhoto", validate, addPhoto);
router.post("/deletePhoto", validate, deletePhoto);
router.post("/editFields", validate, editFields);
router.post("/deleteBook", validate, deleteBook);

export default router;
