import { body, param } from "express-validator";

export const addCommentValidationRules = [
  body("parentId")
    .notEmpty()
    .withMessage("The parent ID is required")
    .isString()
    .withMessage("The parent ID must be a string"),
  body("bookId")
    .notEmpty()
    .withMessage("The book ID is required")
    .isString()
    .withMessage("The book ID must be a string"),
  body("userId")
    .notEmpty()
    .withMessage("The user ID is required")
    .isString()
    .withMessage("The user ID must be a string"),
  body("content")
    .notEmpty()
    .withMessage("The content is required")
    .isString()
    .withMessage("The content must be a string"),
  body("date")
    .notEmpty()
    .withMessage("The date is required")
    .isString()
    .withMessage("The date must be a string"),
];

export const fetchCommentsValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("The parent ID is required")
    .isString()
    .withMessage("The parent ID must be a string"),
];

export const deleteCommentValidationRules = [
  body("id")
    .notEmpty()
    .withMessage("The ID is required")
    .isString()
    .withMessage("The ID must be a string"),
];

export const editCommentValidationRules = [
  ...deleteCommentValidationRules,
  param("content")
    .notEmpty()
    .withMessage("The content is required")
    .isString()
    .withMessage("The content must be a string"),
];
