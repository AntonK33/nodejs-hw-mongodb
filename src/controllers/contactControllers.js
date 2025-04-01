import * as contactsServices from '../services/contactsServices.js';
import {
  updateContactSchema,
  createContactSchema,
} from '../schemas/contactsSchemas.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const { page, perPage, sortBy, sortOrder } = req.query;
    const paginationOptions = {
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      sortBy: sortBy || '_id',
      sortOrder: sortOrder === 'desc' ? SORT_ORDER.DESC : SORT_ORDER.ASC, // ASC/DESC
    };

    const data = await contactsServices.listContacts(paginationOptions);

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactsServices.getContactById({ _id: id });
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
   return res.json({
      status: 200,
      message: 'Successfully found contact !',
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body, {abortEarly: false});
    if (error) {
     throw createHttpError(400, "Validation failed");
    }
    const result = await contactsServices.addContact({ ...req.body });

   return res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: result,
    });
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

    const result = await contactsServices.updateOneContact(
      { _id: id },
      req.body,
    );
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
  
  return  res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  } catch (error) {
    console.error('Mongoose update error:', error);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactsServices.removeContact({ _id: id });
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
   return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder });

   return res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};
