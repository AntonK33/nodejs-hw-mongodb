import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  email: Joi.string(),

  phoneNumber: Joi.string().min(3).max(20).required(),

  photo: { type: String },

  isFavourite: Joi.boolean(),

  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('home'),
}).options({ abortEarly: false });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),

  email: Joi.string(),

  phoneNumber: Joi.string(),

  photo: { type: String },

  isFavourite: Joi.boolean(),

  contactType: Joi.string().valid('work', 'home', 'personal'),
}).options({ abortEarly: false });
