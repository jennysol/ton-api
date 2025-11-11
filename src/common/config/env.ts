import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
require('dotenv').config();

export const ENV = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.string().min(1).default('3000'),
    AWS_REGION: z.string().min(1).default('us-east-1'),
    DYNAMODB_ENDPOINT: z.string().min(1).default('http://localhost:4566'),
    JWT_SECRET: z.string().min(1).default('defaultSecretKey'),
    SALT_ROUNDS: z.string().min(1).default('12'),
    TABLE_NAME: z.string().min(1).default('ton-app'),
  })
  .parse(process.env);
