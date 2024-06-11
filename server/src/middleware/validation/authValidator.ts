import { body, param } from "express-validator";

const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!.@#$%^&*]{8,}$/;

export const registrationValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .isString()
    .withMessage("Email must be a string"),
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 6 })
    .withMessage("Username must be at least 6 characters long")
    .isString()
    .withMessage("Username must be a string"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(passwordRegex)
    .withMessage(
      "Password must contain at least one uppercase letter, one number, and one special character (! . @ # $ % ^ & *)."
    )
    .isString()
    .withMessage("Password must be a string"),
  body("avatar")
    .notEmpty()
    .withMessage("Avatar is required.")
    .isString()
    .withMessage("Avatar must be a string"),
];

export const loginValidationRules = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isString()
    .withMessage("Username must be a string"),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isString()
    .withMessage("Password must be a string"),
];

export const fetchUserValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("User ID missing")
    .isString()
    .withMessage("User ID must be a string"),
];

export const readingStatusValidationRules = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID should be a string"),
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .isString()
    .withMessage("Book ID should be a string"),
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isString()
    .withMessage("status should be a string")
    .isIn(["Want to read", "Read", "Currently reading"])
    .withMessage(
      "Status must be one of 'Want to read', 'Read', 'Currently reading'"
    ),
];

export const fetchByReadingStatusValidationRules = [
  param("userId")
    .notEmpty()
    .withMessage("User ID missing")
    .isString()
    .withMessage("User ID must be a string"),
  param("bookId")
    .notEmpty()
    .withMessage("Book ID missing")
    .isString()
    .withMessage("Book ID must be a string"),
];

export const fetchDrawerBooksValidationRules = [
  param("userId").isString().withMessage("User ID must be a string"),
  param("field")
    .notEmpty()
    .withMessage("Field missing")
    .isString()
    .withMessage("Field must be a string"),
];
