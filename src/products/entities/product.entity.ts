import { Entity } from 'electrodb';
import { client, table } from '../../common/database/dynamodb/client';

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
