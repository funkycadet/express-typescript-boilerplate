// import { User } from "@prisma/client";
import { IUser } from "./interfaces";
import { Request } from "express";


export type TokenData = { id: string; role: string };
export type PublicUserData = Omit<IUser, "password" | "refreshTokens">;

export interface ProtectedRequest extends Request {
  user: IUser;
}
