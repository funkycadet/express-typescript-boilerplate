import jwt from 'jsonwebtoken';

import { TokenData, PublicUserData } from '../types';
import { IUser } from '../interfaces';

export const signJWT = (
  data: TokenData,
  secret: string,
  expiry: string,
): string => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiry,
  });
  return token;
};

export const stripUser = (
  resource: IUser,
  resourceType: 'user',
): PublicUserData => {
  const { password, ...restOfUser } = resource;
  return restOfUser as PublicUserData;
};
