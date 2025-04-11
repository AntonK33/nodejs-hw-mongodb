import { Router } from 'express';
import authController from '../controllers/authController.js';
import validateBody from '../middelwares/validateBody.js';
import { userSignupSchema, userSigninSchema } from '../schemas/usersSchemas.js';

const router = Router();
router.post('/refresh',
  authController.refreshUserSessionController,
);
router.post('/register', validateBody(userSignupSchema), authController.signup);
router.post('/login', validateBody(userSigninSchema), authController.signin);
router.post('/logout',  authController.signout);

export default router;
