import { Role } from "@prisma/client";

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email_address: string;
  phone_number: string;
  password: string;
  role?: Role;
  refreshTokens?: string[];
}
