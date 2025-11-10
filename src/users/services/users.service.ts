import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { IUser } from '../interfaces/users.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(userData: CreateUserDto): Promise<IUser> {
    return this.usersRepository.create(userData);
  }

  async update(
    email: string,
    updateData: Partial<Omit<IUser, 'userId' | 'email'>>,
  ): Promise<IUser | null> {
    return this.usersRepository.update(email, updateData);
  }

  async delete(email: string): Promise<void> {
    await this.usersRepository.delete(email);
  }
}
