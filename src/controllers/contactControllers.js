import * as  contactsServices from "../services/contactsServices.js";
import { updateContactSchema, createContactSchema } from "../schemas/contactsSchemas.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";


export const getAllContacts = async (req, res, next) => {
  
  try {
    const { page, perPage } = req.query;
    const  paginationOptions = {
      page: Number(page) || 1, // Значение по умолчанию — 1
      perPage: Number(perPage) || 10, // Значение по умолчанию — 10
    };
        const result = await contactsServices.listContacts(paginationOptions);
         res.json(result);
    } catch (error) {
         next(error);
    }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Запрос на поиск ID:", id);
    const result = await contactsServices.getContactById({ _id: id });
    if (!result) {
      throw createHttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
   const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
    }
   const result = await contactsServices.addContact({...req.body});
    res.status(201).json(result);
 } catch (error) {
  next(error);
 }
 
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
    }
    const { id } = req.params;
    // const { _id: owner } = req.user;
    const result = await contactsServices.updateContactById( req.body);
    if (!result) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await contactsServices.removeContact(id);
     if (!result) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
      message: "Delete success",
    });
    
    } catch (error) {
      next(error);   
    }
};

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const contacts = await getAllContacts({ page, perPage });
    
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts
    });

  } catch (error) {
    next(error);   
  }
  
};