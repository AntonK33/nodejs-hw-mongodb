import { Router } from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  updateContact,
  addContact,
} from '../controllers/contactControllers.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import validateBody from '../middelwares/validateBody.js';
import ctrlWrapper from '../middelwares/ctrlWrapper.js';
import isValidId from '../middelwares/isValidId.js';
import authenticate from '../middelwares/authenticate.js';
import { upload } from '../middelwares/multer.js';
const router = Router();

router.get('/', authenticate, ctrlWrapper(getAllContacts));

router.get('/:id', authenticate, isValidId, ctrlWrapper(getOneContact));

router.post(
  '/',upload.single('photo'),
  
  authenticate,
 
  validateBody(createContactSchema),
  ctrlWrapper(addContact),
);

router.patch(
  '/:id', upload.single('photo'),
  authenticate,
  isValidId,
  
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);

router.delete('/:id', authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
