import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ENV } from '../../config/env';

@Injectable()
export class EncryptionService {
  async hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, Number(ENV.SALT_ROUNDS));
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
