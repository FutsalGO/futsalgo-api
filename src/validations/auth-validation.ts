import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  phone: Joi.string()
    .pattern(/^(?:\+62|62|0)[0-9]{9,13}$/)
    .message("Phone number must be a valid Indonesian number")
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
