import { v4 as uuid } from 'uuid';
import createError from 'http-errors';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createEvent(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const newEvent = {
    id: uuid(),
    title,
    eventType: 'DAILY',
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString()
  };

  try {
    await dynamodb.put({
      TableName: process.env.EVENTS_TABLE_NAME,
      Item: newEvent,
    }).promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(newEvent),
  };
}

export const handler = createEvent;


