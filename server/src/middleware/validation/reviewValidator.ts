import { body, param } from "express-validator";

export const addReviewValidationRules = [
  body("userId")
    .notEmpty()
    .withMessage("The user ID is required.")
    .isString()
    .withMessage("The user ID must be a string."),
  body("date")
    .notEmpty()
    .withMessage("The date is required.")
    .isString()
    .withMessage("The date must be a string."),
  body("stars")
    .notEmpty()
    .withMessage("The stars value is required.")
    .isFloat()
    .withMessage("The stars value must be a float."),
  body("finished")
    .notEmpty()
    .withMessage("The finished status value is required.")
    .isBoolean()
    .withMessage("The finished status value must be a boolean."),
  body("spoilers")
    .notEmpty()
    .withMessage("The spoilers value is required.")
    .isBoolean()
    .withMessage("The spoilers value must be a boolean."),
  body("content")
    .notEmpty()
    .withMessage("The content is required.")
    .isString()
    .withMessage("The content must be a string."),
];

export const fetchReviewsValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("The parent ID is required.")
    .isString()
    .withMessage("The parent ID must be a string."),
];

export const sortStarsValidationRules = [
  ...fetchReviewsValidationRules,
  param("stars")
    .notEmpty()
    .withMessage("The stars value is required.")
    .isFloat()
    .withMessage("The stars value must be a float."),
];

export const sortFinishedValidationRules = [
  ...fetchReviewsValidationRules,
  param("finished")
    .notEmpty()
    .withMessage("The finished status value is required.")
    .isBoolean()
    .withMessage("The finished status value must be a boolean."),
];

export const editReviewValidationRules = [
  body("id")
    .notEmpty()
    .withMessage("Review ID is required")
    .isString()
    .withMessage("Review ID must be a string"),
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isString()
    .withMessage("Book ID must be a string"),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  body("stars")
    .notEmpty()
    .withMessage("The stars value is required.")
    .isFloat()
    .withMessage("The stars value must be a float."),
  body("finished")
    .notEmpty()
    .withMessage("The finished status value is required.")
    .isBoolean()
    .withMessage("The finished status value must be a boolean."),
  body("oldStars")
    .notEmpty()
    .withMessage("The old stars value is required.")
    .isFloat()
    .withMessage("The old stars value must be a float."),
];
export const deleteReviewValidationRules = [
  body("id")
    .notEmpty()
    .withMessage("Book ID is required")
    .isString()
    .withMessage("Book ID must be a string"),
  body("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isString()
    .withMessage("Review ID must be a string"),
  body("stars")
    .notEmpty()
    .withMessage("The stars value is required.")
    .isFloat()
    .withMessage("The stars value must be a float."),
];
