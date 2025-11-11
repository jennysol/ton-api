import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  controllers: [],
  providers: [UserService, UsersRepository],
  exports: [UserService],
})
export class UsersModule {}
