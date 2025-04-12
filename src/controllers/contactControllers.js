import * as contactsServices from '../services/contactsServices.js';
import {
  updateContactSchema,
  createContactSchema,
} from '../schemas/contactsSchemas.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import ctrlWrapper from '../middelwares/ctrlWrapper.js';


 const getOneContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await contactsServices.getContactById({ _id: id, userId });
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
    return res.json({
      status: 200,
      message: 'Successfully found contact with id {id}!',
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

 const addContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, 'Validation failed');
    }
    const result = await contactsServices.addContact({ ...req.body, userId });
    return res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

 const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const photo = req.file;
    
  let photoUrl;

  
    if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
    
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
    }
    const { id } = req.params;

    const result = await contactsServices.updateOneContact(
      { _id: id, userId },
     { ...req.body,
      photo: photoUrl,}
    );
    if (!result) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }
    return res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

 const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userId = req.user._id;

    const result = await contactsServices.removeContact({ _id: id, userId });
    if (!result) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getContactsController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, perPage } = parsePaginationParams(req.query);
    
    const { sortBy, sortOrder } = parseSortParams(req.query);
   
    
    const data = await contactsServices.listContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      userId
    });

    return res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data
    });
  } catch (error) {
    next(error);
  }
};
export default {
  
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  addContact: ctrlWrapper(addContact),
  getContactsController: ctrlWrapper(getContactsController)
};