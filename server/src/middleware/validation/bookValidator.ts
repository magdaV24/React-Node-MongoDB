import { body, param } from "express-validator";

export const addBookValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required.")
    .isString()
    .withMessage("Title must be a string."),
  body("author")
    .notEmpty()
    .withMessage("Author is required.")
    .isString()
    .withMessage("Author must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .isString()
    .withMessage("Description must be a string"),
  body("published")
    .notEmpty()
    .withMessage("Publishing date is required.")
    .isString()
    .withMessage("Publishing date must be a string."),
  body("pages")
    .notEmpty()
    .withMessage("Number of pages is required.")
    .isInt()
    .withMessage("Number of pages must be an integer."),
  body("language")
    .notEmpty()
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string."),
  body("photos")
    .notEmpty()
    .withMessage("Photos is required")
    .isArray()
    .withMessage("Photos must be an array."),
  body("genres")
    .notEmpty()
    .withMessage("The genres array is required.")
    .isArray()
    .withMessage("The genres must be an array."),
];

export const fetchBookValidationRules = [
  param("title")
    .notEmpty()
    .withMessage("Title is required.")
    .isString()
    .withMessage("Title must be a string."),
];

export const handlePhotoValidationRules = [
  body("id")
    .notEmpty()
    .withMessage("Book ID is required.")
    .isString()
    .withMessage("Book Id must be a string."),
  body("photo")
    .notEmpty()
    .withMessage("Photo is required.")
    .isString()
    .withMessage("Photo must be a string."),
];

export const editBookValidationRules = [
  ...addBookValidationRules,
  body("id")
    .notEmpty()
    .withMessage("Book ID is required.")
    .isString()
    .withMessage("Book Id must be a string."),
];

export const deleteBookValidationRules = [
  body("id")
    .notEmpty()
    .withMessage("Book ID is required.")
    .isString()
    .withMessage("Book Id must be a string."),
  body("photos")
    .notEmpty()
    .withMessage("The public_ids array is required.")
    .isArray()
    .withMessage("The photos' public_ids must be an array."),
];
