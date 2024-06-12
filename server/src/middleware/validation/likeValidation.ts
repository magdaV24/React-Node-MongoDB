import { body, param } from "express-validator";

export const likeObjectValidationRules = [
  body("objectId")
    .notEmpty()
    .withMessage("Object ID is required.")
    .isString()
    .withMessage("Object ID must be a string"),
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required.")
    .isString()
    .withMessage("Book ID must be a string"),
  body("userId")
    .notEmpty()
    .withMessage("User ID is required.")
    .isString()
    .withMessage("User ID must be a string"),
];

export const countLikesValidationRules = [
  param("objectId")
    .withMessage("Object ID is required.")
    .isString()
    .withMessage("Object ID must be a string"),
];

export const checkIfLikedValidationRules = [
  ...countLikesValidationRules,
  param("userId")
    .withMessage("User ID is required.")
    .isString()
    .withMessage("User ID must be a string"),
];
