import Joi from 'joi';

const gender = ['male', 'female'];

export const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  gender: Joi.string()
    .valid(...gender)
    .required(),
  // role: Joi.string().valid("user", "admin").required(),
});

export const loginSchema = Joi.object({
  emailAddress: Joi.string().required(),
  password: Joi.string().required(),
});
