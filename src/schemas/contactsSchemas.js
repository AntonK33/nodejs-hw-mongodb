import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string()
      .min(3)  
    .max(20)
    .required()
    .messages({
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name must be less than or equal to 20 characters long",
      "any.required": "Name is required",
  }),
  email: Joi.string()
    
    .required(),
  phoneNumber: Joi.string().required()
  .pattern(/^\d{10,15}$/) // Перевірка на номер телефону (10-15 цифр)
    .min(3)  // Мінімум 3 символи
    .max(20) // Максимум 20 символів
    .required()
    .messages({
      "string.pattern.base": "Phone must be a valid phone number",
      "string.min": "Phone must be at least 3 characters long",
      "string.max": "Phone must be less than or equal to 20 characters long",
      "any.required": "Phone is required",
    })

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