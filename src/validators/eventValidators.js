import { body } from "express-validator";

export const createEventRules = [
  body("title").notEmpty(),
  body("date").notEmpty(),
  body("time").notEmpty(),
  body("location").notEmpty(),
  body("organizerName").notEmpty(),
  body("description").optional(),
];

export const updateEventRules = [
  body("title").optional(),
  body("date").optional(),
  body("time").optional(),
  body("location").optional(),
  body("organizerName").optional(),
  body("description").optional(),
];
