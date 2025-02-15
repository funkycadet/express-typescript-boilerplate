import { UserController } from '../controllers';
import { Router } from 'express';
import { validateReqBody, validateJWT } from '../middlewares';

const userController = new UserController();
const userRouter = Router();

userRouter.get('/', userController.getAll);
userRouter.get('/me', validateJWT(), userController.getMe);
userRouter.get('/:id', userController.getUserById);
userRouter.get('/user/:params', userController.getUser);
userRouter.patch('/:id', userController.updateUser);

export default userRouter;
