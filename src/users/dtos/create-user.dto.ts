import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Omit<IUser, 'userId'> {
  name: string;
  email: string;
  passwordHash: string;
}
