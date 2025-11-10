import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users.entity';
import { IUser } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name, {
    timestamp: true,
  });

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const { data } = await User.query.byEmail({ email }).go({
        limit: 1,
      });
      const [user] = data;

      return user ?? null;
    } catch (error) {
      this.logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  async create(userData: CreateUserDto): Promise<IUser> {
    try {
      const { data } = await User.create({
        userId: uuidv4(),
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
      }).go();

      return data;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }

  async update(
    email: string,
    updateData: Partial<Omit<IUser, 'userId' | 'email'>>,
  ): Promise<IUser | null> {
    try {
      const { data } = await User.query.byEmail({ email }).go({ limit: 1 });
      const [existingUser] = data;

      if (!existingUser) {
        return null;
      }

      const result = await User.update({
        userId: existingUser.userId,
        name: existingUser.name,
        email: existingUser.email,
      })
        .set(updateData)
        .go();

      return (result.data as IUser) ?? null;
    } catch (error) {
      this.logger.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(email: string): Promise<void> {
    try {
      const { data } = await User.query.byEmail({ email }).go({ limit: 1 });
      const [user] = data;

      if (!user) return;

      await User.delete({
        userId: user.userId,
        name: user.name,
        email: user.email,
      }).go();
    } catch (error) {
      this.logger.error('Error deleting user:', error);
      throw error;
    }
  }
}
