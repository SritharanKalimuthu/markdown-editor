import Joi from "joi";
import { name, email, password } from "./common.validation.js";

export const registerUserSchema = Joi.object({
  name,
  email,
  password,
});

export const loginSchema = Joi.object({
  email,
  password,
});

export const getUserSchema = Joi.object({
  email,
});
