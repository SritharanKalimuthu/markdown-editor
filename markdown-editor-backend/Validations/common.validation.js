import Joi from "joi";

export const name = Joi.string()
  .pattern(/^[a-zA-Z\s]+$/)
  .min(3)
  .max(50)
  .required()
  .messages({
    "string.pattern.base": "Name can only contain letters and spaces.",
  });

export const email = Joi.string().email().required();

export const password = Joi.string()
  .min(6)
  .max(128)
  .required()
  .messages({
    "string.min": "Password must be at least 6 characters.",
  });

export const otp = Joi.string().min(6).required();