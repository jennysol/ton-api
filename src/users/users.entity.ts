import * as AWS from 'aws-sdk';
import { Entity } from 'electrodb';
import { ENV } from '../common/config/env';

const client = new AWS.DynamoDB.DocumentClient({
  region: ENV.AWS_REGION,
  endpoint: ENV.DYNAMODB_ENDPOINT,
});

const table = 'ton-app';

export const User = new Entity(
  {
    model: {
      entity: 'user',
      version: '1',
      service: 'ton-service',
    },
    attributes: {
      userId: {
        type: 'string',
        required: true,
      },
      name: {
        type: 'string',
        required: true,
      },
      email: {
        type: 'string',
        required: true,
      },
      passwordHash: {
        type: 'string',
        required: false,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['userId'],
        },
        sk: {
          field: 'sk',
          composite: ['name', 'email'],
        },
      },
      byEmail: {
        index: 'gsi1pk-gsi1sk-index',
        pk: {
          field: 'gsi1pk',
          composite: ['email'],
        },
        sk: {
          field: 'gsi1sk',
          composite: [],
        },
      },
    },
  },
  { client, table },
);
