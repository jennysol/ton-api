import * as AWS from 'aws-sdk';
import { ENV } from '../../config/env';

export const client = new AWS.DynamoDB.DocumentClient({
  region: ENV.AWS_REGION,
  endpoint: ENV.DYNAMODB_ENDPOINT,
});

export const table = ENV.TABLE_NAME;
