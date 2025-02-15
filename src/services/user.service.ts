import { db } from '../database';
import { IUser, IUserSignup } from '../interfaces';

class UserService {
  public async getAllUsers(skip: number, limit: number): Promise<IUser[]> {
    return await db.user.findMany({
      skip,
      take: limit,
    });
  }

  public async getUserById(id: string): Promise<IUser> {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async getUser(filter: object): Promise<IUser> {
    return await db.user.findFirst({
      where: filter,
    });
  }

  public async createUser(data: IUserSignup): Promise<IUser> {
    return await db.user.create({
      data,
    });
  }

  public async updateUser(id: string, data: object): Promise<IUser> {
    return await db.user.update({
      where: {
        id,
      },
      data,
    });
  }

  public async deleteUser(id: string): Promise<IUser> {
    return await db.user.delete({
      where: {
        id,
      },
    });
  }
}

export default UserService;
