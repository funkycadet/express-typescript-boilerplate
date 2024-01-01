import { Request } from 'express';
import { IUser } from './interfaces';
// import { User } from '@prisma/client';

export type TokenData = { id: string; resourceType: string };

export interface ProtectedRequest extends Request {
  user?: IUser;
}

export type PublicUserData = Omit<IUser, 'password' | 'refreshTokens'>;
