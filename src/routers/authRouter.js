import { Router } from 'express';
import authController from '../controllers/authController.js';
import validateBody from '../middelwares/validateBody.js';
import { userSignupSchema, userSigninSchema } from '../schemas/usersSchemas.js';
import authenticate from '../middelwares/authenticate.js';

const router = Router();

router.post('/register', validateBody(userSignupSchema), authController.signup);
router.post('/login', validateBody(userSigninSchema), authController.signin);
router.get('/current', authenticate, authController.getCurrent);
router.post('/logout', authenticate, authController.signout);
router.post(
  '/refresh',
  authenticate,
  authController.refreshUserSessionController,
);
export default router;
