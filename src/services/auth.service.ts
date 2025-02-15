import * as argon from 'argon2';
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from '../config';
import { db } from '../database';
import UserService from './user.service';
import { IUser, IUserLogin, IUserSignup } from '../interfaces';
import { signJWT, verifyJWT } from '../utils';
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../exceptions';

class AuthService {
  user: UserService;

  constructor() {
    this.user = new UserService();
  }

  public signToken(resource: IUser): {
    refreshToken: string;
    accessToken: string;
  } {
    const dataToSign = {
      id: resource.id,
      role: resource.role,
    };

    const accessToken = signJWT(
      dataToSign,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY,
    );
    const refreshToken = signJWT(
      dataToSign,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY,
    );

    return { accessToken, refreshToken };
  }

  async signup(dto: IUserSignup) {
    const hashedPassword = await argon.hash(dto.password);

    const existingUser = await this.user.getUser({
      emailAddress: dto.emailAddress,
    });
    if (existingUser) throw new ForbiddenError(`User already exists`);

    const user = await this.user.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      emailAddress: dto.emailAddress,
      password: hashedPassword,
      gender: dto.gender,
    });
    return user;
  }

  async adminSignup(dto: IUserSignup) {
    const hashedPassword = await argon.hash(dto.password);

    const existingUser = await this.user.getUser({
      emailAddress: dto.emailAddress,
    });
    if (existingUser) throw new ConflictError(`User already exists!`);

    const user = await this.user.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      emailAddress: dto.emailAddress,
      password: hashedPassword,
      gender: dto.gender,
      role: 'admin',
    });

    return user;
  }

  public async login(dto: IUserLogin): Promise<{
    data: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await db.user.findUnique({
      where: {
        emailAddress: dto.emailAddress,
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new UnauthorizedError(`Incorrect email or password!`);
    }
    const { refreshToken, accessToken } = this.signToken(user);
    // const resourceToReturn = stripUser(user);

    return { data: user, accessToken, refreshToken };
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) throw new UnauthorizedError(`No token provided`);

    const token: any = verifyJWT(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await this.user.getUser({
      id: token.id,
    });

    if (!user) throw new NotFoundError(`No user found`);

    const accessToken = signJWT(
      {
        id: user.id,
        role: user.role,
      },
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY,
    );
    return { accessToken };
  }
}

export default AuthService;
