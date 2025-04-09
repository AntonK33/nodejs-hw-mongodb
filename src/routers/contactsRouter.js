import { Router } from 'express';
import contactControllers from '../controllers/contactControllers.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import validateBody from '../middelwares/validateBody.js';
import isValidId from '../middelwares/isValidId.js';
import authenticate from '../middelwares/authenticate.js';
import { upload } from '../middelwares/multer.js';
const router = Router();

router.get('/', authenticate,
  contactControllers.getContactsController);

router.get('/:id', authenticate, isValidId,
  contactControllers.getOneContact);

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(createContactSchema),
  contactControllers.addContact,
);

router.patch(
  '/:id',
  authenticate,
  isValidId,
   upload.single('photo'),
  validateBody(updateContactSchema),
  contactControllers.updateContact,
);

router.delete('/:id', authenticate, isValidId, contactControllers.deleteContact);

export default router;
