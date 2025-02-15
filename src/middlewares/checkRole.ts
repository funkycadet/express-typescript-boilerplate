import { Response, NextFunction, RequestHandler } from 'express';
import { ProtectedRequest } from '../types';
import { ForbiddenError } from '../exceptions';

/**
 * Middleware to check if the user has one of the required roles
 * @param roles Array of roles that are allowed to access the route
 */
export default function (roles: string[]): RequestHandler {
  return (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role) {
        throw new ForbiddenError(`No roles found for the user!`);
      }

      // const hasRole = req.user.role.some((role) => roles.includes(role.name));
      const hasRole = roles.includes(req.user.role);

      if (!hasRole) {
        throw new ForbiddenError(
          `User does not have permission to access this resource!`,
        );
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
