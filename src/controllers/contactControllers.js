import * as contactsServices from '../services/contactsServices.js';
import {
  updateContactSchema,
  createContactSchema,
} from '../schemas/contactsSchemas.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { SORT_ORDER } from '../constants/index.js';
import ctrlWrapper from '../middelwares/ctrlWrapper.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { page, perPage, sortBy, sortOrder } = req.query;
    const paginationOptions = {
      page: Number(page) || 1, // Значение по умолчанию — 1
      perPage: Number(perPage) || 4, // Значение по умолчанию — 10
      sortBy: sortBy || '_id', // Сортировка по умолчанию — по _id
      sortOrder: sortOrder === 'desc' ? SORT_ORDER.DESC : SORT_ORDER.ASC, // ASC/DESC
    };

    const data = await contactsServices.listContacts(
      { userId },
      paginationOptions,
    );

    return res.json({
      status: 200,
      message: 'Successfully found contacts!',
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const data = await contactsServices.getContactById({ _id: id, userId });
    if (!data) {
      throw createHttpError(404, 'Contact not found');
    }
    return res.json({
      status: 200,
      message: 'Successfully found contact !',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, 'Validation failed');
    }
    const data = await contactsServices.addContact({ ...req.body, userId });
    return res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
    }
    const { id } = req.params;

    const data = await contactsServices.updateOneContact(
      { _id: id, userId },
      req.body,
    );
    if (!data) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }
    return res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userId = req.user._id;

    const data = await contactsServices.removeContact({ _id: id, userId });
    if (!data) {
      throw createHttpError(404, `Contact with id=${id} not found`);
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
    const result = await getAllContacts({  page,
    perPage,
    sortBy,
    sortOrder,
    filter,});

    return res.json({
      status: 200,
      message: 'Successfully found contacts!',      
      data:result
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  addContact: ctrlWrapper(addContact),
};
