import Joi from "joi";

const gender = ["male", "female"]

export const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email_address: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().required().min(8),
  gender: Joi.string().valid(...gender).required(),
  // role: Joi.string().valid("user", "admin").required(),
});

export const loginSchema = Joi.object({
  email_address: Joi.string().required(),
  password: Joi.string().required(),
});
