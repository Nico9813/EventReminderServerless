import { v4 as uuid } from 'uuid';
import createError from 'http-errors';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createEvent(event, context) {
  const { title, eventType, firstTime } = JSON.parse(event.body);
  const { email } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const newEvent = {
    id: uuid(),
    title,
    eventType,
    status: 'OPEN',
    createdBy: email,
    nextTime: firstTime, 
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
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(newEvent),
  };
}

export const handler = createEvent;


