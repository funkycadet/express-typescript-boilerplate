import { IUser, Pageable } from './interfaces';
import { Request } from 'express';
import * as core from 'express-serve-static-core';

export type TokenData = {
  id: string;
  role: string;
};

export type PublicUserData = Omit<IUser, 'password' | 'refreshTokens'>;

// export interface ProtectedRequest extends Request {
//   user: IUser;
// }

export interface ProtectedRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: IUser;
}

export type PageableQuery<T = {}> = Pageable<T> & core.Query;
export type ProtectedPageableRequest<QueryType = Record<string, any>> =
  ProtectedRequest<core.ParamsDictionary, any, any, PageableQuery<QueryType>>;
