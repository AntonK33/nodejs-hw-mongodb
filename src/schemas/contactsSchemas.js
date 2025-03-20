import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().required()

});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phoneNumber: Joi.string(),
  isFavourite: Joi.boolean()
});

export const updatePatchContactSchema = Joi.object({
  isFavourite: Joi.boolean().required()
});