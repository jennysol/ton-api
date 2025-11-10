import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserService } from './services/users.service';

@Module({
  controllers: [],
  providers: [UserService, UsersRepository],
  exports: [UserService],
})
export class UsersModule {}
