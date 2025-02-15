import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../exceptions';
import { ACCESS_TOKEN_SECRET } from '../config';
import { ProtectedRequest } from '../types';
import { IUser } from '../interfaces';

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

      const decoded = jwt.verify(token, String(ACCESS_TOKEN_SECRET)) as IUser;
      req.user = decoded;

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
