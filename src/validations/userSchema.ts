import Joi from 'joi';

export const updateUserSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
});
