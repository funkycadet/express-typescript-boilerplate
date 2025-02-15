import { Prisma, Role } from '@prisma/client';

// export interface IUser {
//   id?: string;
//   firstName: string;
//   lastName: string;
//   email_address: string;
//   phone_number: string;
//   password: string;
//   gender: string;
//   roles?: Role[];
//   refreshTokens?: string[];
// }
//
export type IUser = Omit<Prisma.$UserPayload['scalars'], ''>;

export interface IUserSignup {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  gender: string;
  role?: Role;
}

export interface IUserLogin {
  emailAddress: string;
  password: string;
}

export interface IUpdateUserPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
