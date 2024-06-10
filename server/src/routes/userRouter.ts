import express from "express";
import {
  addReadingStatus,
  changeReadingStatus,
  fetchByReadingStatus,
  fetchUser,
  findReadingStatus,
  login,
  register,
} from "../database/controllers/UserController";
import {
  readingStatusValidationRules,
  fetchUserValidationRules,
  loginValidationRules,
  registrationValidationRules,
  fetchByReadingStatusValidationRules,
  fetchDrawerBooksValidationRules,
} from "../middleware/validation/authValidator";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/register", registrationValidationRules, validate, register);
router.post("/login", loginValidationRules, validate, login);
router.get("/fetchUser/:id?", fetchUserValidationRules, validate, fetchUser);
router.post(
  "/addReadingStatus",
  readingStatusValidationRules,
  validate,
  addReadingStatus
);
router.post(
  "/changeReadingStatus",
  readingStatusValidationRules,
  validate,
  changeReadingStatus
);
router.get(
  "/findReadingStatus/:userId/:bookId",
  fetchByReadingStatusValidationRules,
  validate,
  findReadingStatus
);
router.get(
  "/fetchDrawerBooks/:userId?/:field",
  fetchDrawerBooksValidationRules,
  validate,
  fetchByReadingStatus
);

export default router;
