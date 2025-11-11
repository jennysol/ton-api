import { IUser } from '../interfaces/users.interface';

export class CreateUserDto implements Omit<IUser, 'userId'> {
  name: string;
  email: string;
  passwordHash: string;
}
