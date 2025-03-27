import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  email: Joi.string(),

  phoneNumber: Joi.string().min(3).max(20).required(),

  isFavourite: Joi.boolean(),

  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),

  email: Joi.string(),

  phoneNumber: Joi.string(),

  isFavourite: Joi.boolean(),

  contactType: Joi.string().valid('work', 'home', 'personal'),
});
