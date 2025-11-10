import * as AWS from 'aws-sdk';
import { Entity } from 'electrodb';
import { ENV } from '../common/config/env';

const client = new AWS.DynamoDB.DocumentClient({
  region: ENV.AWS_REGION,
  endpoint: ENV.DYNAMODB_ENDPOINT,
});

const table = 'ton-app';

export const Product = new Entity(
  {
    model: {
      entity: 'product',
      version: '1',
      service: 'ton-service',
    },
    attributes: {
      productId: {
        type: 'string',
        required: true,
      },
      title: {
        type: 'string',
        required: true,
      },
      description: {
        type: 'string',
        required: true,
      },
      price: {
        type: 'number',
        required: true,
      },
      publishDate: {
        type: 'string',
        required: true,
      },
      photoLink: {
        type: 'string',
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['productId'],
        },
        sk: {
          field: 'sk',
          composite: [],
        },
      },
    },
  },
  { client, table },
);
