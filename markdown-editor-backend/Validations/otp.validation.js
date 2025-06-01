import Joi from "joi";
import { otp, email } from "./common.validation.js";

export const otpSchema = Joi.object({
    identifier : email,
    otp,
})