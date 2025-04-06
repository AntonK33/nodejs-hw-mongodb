import { Router } from 'express';
import authController from '../controllers/authController.js';
import validateBody from '../middelwares/validateBody.js';
import { userSignupSchema, userSigninSchema } from '../schemas/usersSchemas.js';
import authenticate from '../middelwares/authenticate.js';
import { confirmOauthShema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";
import { upload } from "../middelwares/multer.js";


const router = Router();

router.post('/register',upload.none(), validateBody(userSignupSchema), authController.signup);
router.post('/login',upload.none(), validateBody(userSigninSchema), authController.signin);
router.post('/logout', authenticate, authController.signout);
router.post(
  '/refresh',
  authenticate,
  authController.refreshUserSessionController
);
router.post('/send-reset-email',validateBody(requestResetEmailSchema), authController.requestResetEmailController);
router.post('/reset-password', validateBody(resetPasswordSchema), authController.resetPasswordController);
router.get("/get-oauth-url", authController.getOauthUrlController);
router.post("/confirm-oauth", validateBody(confirmOauthShema), authController.confirmOAuthController);
export default router;
