import { Router } from 'express';
import authController from '../controllers/authController.js';
import validateBody from '../middelwares/validateBody.js';
import { userSignupSchema, userSigninSchema } from '../schemas/usersSchemas.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = Router();

router.post('/register', validateBody(userSignupSchema), authController.signup);
router.post('/login', validateBody(userSigninSchema), authController.signin);
router.post('/logout', authController.signout);
router.post('/refresh', authController.refreshUserSessionController);
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  authController.requestResetEmailController,
);
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  authController.resetPasswordController,
);
export default router;
