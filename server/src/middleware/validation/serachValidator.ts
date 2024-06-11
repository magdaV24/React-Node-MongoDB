import { body } from "express-validator";

export const searchValidationRules = [
  body("input")
    .notEmpty()
    .withMessage("The input is required.")
    .isString()
    .withMessage("The input must be a string."),
];
