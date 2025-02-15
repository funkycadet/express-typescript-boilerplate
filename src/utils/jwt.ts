import { TokenData, PublicUserData } from '../types';
import { IUser } from '../interfaces';

import jwt from 'jsonwebtoken';

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

export const verifyJWT = (token: string, secret: string): TokenData | null => {
  const decoded = jwt.verify(token, secret) as TokenData;
  return decoded;
  // try {
  //   const decoded = jwt.verify(token, secret) as TokenData;
  //   return decoded;
  // } catch (error) {
  //   console.error("Failed to verify token:", error);
  //   return null;
  // }
};

// export const stripUser = (resource: IUser): PublicUserData => {
//   if (resource.role === "user") {
//     const { password, ...restOfUser } = resource;
//     return restOfUser as PublicUserData;
//   } else {
//     //  if (resource.role === "admin") {
//     const { password, ...restOfUser } = resource;
//     return restOfUser as PublicUserData;
//   }
// };
