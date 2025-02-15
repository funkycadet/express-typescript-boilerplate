import { AuthController } from '../controllers';
import { Router } from 'express';
import { validateReqBody } from '../middlewares';
import { loginSchema, signupSchema } from '../validations';

const authController = new AuthController();
const authRouter = Router();

authRouter.post(
  '/signup',
  validateReqBody(signupSchema),
  authController.signup,
);
authRouter.post('/login', validateReqBody(loginSchema), authController.login);
authRouter.post('/refresh-token', authController.refreshTokens);

export default authRouter;
