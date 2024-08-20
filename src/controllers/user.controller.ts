import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import { BadRequestError, UnauthorizedError } from '../exceptions';
import { ProtectedRequest } from '../types';

class UserController {
  service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const { limit, skip } = req.query;
      const limitValue = limit ? Number(limit) : 20;
      const offsetValue = skip ? Number(skip) : 0;

      const users = await this.service.getAllUsers(offsetValue, limitValue);

      return res.status(200).json({ status: 'success', data: users });
    } catch (err: any) {
      next(err);
    }
  };

  getMe = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const userId = req.user?.id;
      if (!userId)
        throw new UnauthorizedError(`Unauthorized! Please log in to continue`);

      // const id = req.params.id;
      const foundUser = await this.service.getUserById(userId);
      return res.status(200).json({ status: 'success', data: foundUser });
    } catch (err: any) {
      next(err);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;
      if (!id) throw new BadRequestError(`No id provided`);

      const user = await this.service.getUserById(id);

      return res.status(200).json({ status: 'success', data: user });
    } catch (err: any) {
      next(err);
    }
  };

  getUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const queryParams = req.query;
      if (!queryParams || Object.keys(queryParams).length === 0) {
        throw new BadRequestError('No search parameters provided');
      }

      const validParams = ['email_address', 'role']; // Define valid keys here
      const searchParams = Object.keys(queryParams)
        .filter((key) => validParams.includes(key))
        .reduce((obj, key) => {
          obj[key] = queryParams[key];
          return obj;
        }, {});

      if (Object.keys(searchParams).length === 0) {
        throw new BadRequestError('No valid search parameters provided');
      }

      // if (!email_address)
      //   throw new BadRequestError(`No email address provided`);

      const user = await this.service.getUser({ searchParams });
      // const foundUser = stripUser(user);

      return res.status(200).json({ status: 'success', data: user });
    } catch (err: any) {
      next(err);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const id = req.params.id;
      if (!id) throw new BadRequestError(`No id provided`);

      const data = req.body;
      if (!data) throw new BadRequestError(`No data provided`);

      const user = await this.service.updateUser(id, data);

      return res.status(200).json({ status: 'success', data: user });
    } catch (err: any) {
      next(err);
    }
  };
}

export default UserController;
