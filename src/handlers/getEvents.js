import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getEvent(event, context) {

  let events;

  try {
    const result = await dynamodb.scan({ TableName: process.env.EVENTS_TABLE_NAME}).promise();
    events = result.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(events),
  };
}

export const handler = getEvent;


