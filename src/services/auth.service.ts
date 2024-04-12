import * as argon from "argon2";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config";
import { db } from "../database";
import UserService from "./user.service";
import { IUser } from "../interfaces";
import { signJWT, stripUser, verifyJWT } from "../utils";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../exceptions";

class AuthService {
  user: UserService;

  constructor() {
    this.user = new UserService();
  }

  public signToken(resource: IUser): {
    refreshToken: string;
    accessToken: string;
  } {
    const dataToSign = { id: resource.id, role: resource.role };

    const accessToken = signJWT(
      dataToSign,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = signJWT(
      dataToSign,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    return { accessToken, refreshToken };
  }

  public async signup(
    firstName: string,
    lastName: string,
    email_address: string,
    phone_number: string,
    password: string
  ): Promise<any> {
    const hashedPassword = await argon.hash(password);

    const existingUser = await this.user.getUser({ email_address });
    if (existingUser) throw new ForbiddenError(`User already exists`);

    const user = await this.user.createUser({
      firstName,
      lastName,
      email_address,
      phone_number,
      password: hashedPassword,
    });
    return stripUser(user);
  }

  public async login(
    email_address: string,
    password: string
  ): Promise<{
    data?: any;
    accessToken: string;
    refreshToken: string;
  }> {
    // let resource: any;
    const user = await db.user.findUnique({
      where: {
        email_address,
      },
    });

    if (!user || !(await argon.verify(user.password, password))) {
      throw new UnauthorizedError(`Incorrect email or password!`);
    }
    const { refreshToken, accessToken } = this.signToken(user);
    // const resourceToReturn = stripUser(user);

    const refreshTokens = user.refreshTokens;
    await this.user.updateUser(user.id, {
      refreshTokens: [...refreshTokens, refreshToken],
    });
    // refreshTokens.push(refreshToken);
    return { data: stripUser(user), accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) throw new UnauthorizedError(`No token provided`);

    const token: any = verifyJWT(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await this.user.getUser({
      id: token.id,
      refreshTokens: token.refreshToken,
    });

    if (!user) throw new NotFoundError(`No user found`);

    const accessToken = signJWT(
      { id: user.id, role: user.role },
      // user,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY
    );
    return { accessToken };
    // const user = await this.user.getUser({ refreshTokens: refreshToken });
    // if (!user.refreshTokens)
    // try {
    //   const token: any = verifyJWT(refreshToken, REFRESH_TOKEN_SECRET)
    //   const user = await this.user.getUser(token.id)

    // }
  }
}

export default AuthService;
