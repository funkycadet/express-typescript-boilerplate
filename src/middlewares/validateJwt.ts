import {
  Express,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { UnauthorizedError } from '../exceptions';
import { ACCESS_TOKEN_SECRET } from '../config';
import { UserService } from '../services';
import { ProtectedRequest } from '../types';

const user = new UserService();

export default function validateJWT(): RequestHandler {
  return async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization)
        throw new UnauthorizedError(`No authorization headers passed`);

      const bearer = authorization.split(' ')[0];
      const token = authorization.split(' ')[1];

      if (!bearer || !token)
        throw new UnauthorizedError(
          `Token not passed in authorization headers`,
        );

      if (bearer !== 'Bearer')
        throw new UnauthorizedError(
          `Bearer not passed in authorization headers`,
        );

      const decoded: any = jwt.verify(token, String(ACCESS_TOKEN_SECRET));

      if (decoded.role === 'patient') {
        const resource = await user.getUserById(decoded.id);

        if (!resource)
          throw new UnauthorizedError(
            `Authentication failed. User account not found. Please log in to continue!`,
          );

        req.user = resource;
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
