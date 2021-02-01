import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getEvent(id) {
  let event;

  try {
    const result = await dynamodb.get({
      TableName: process.env.EVENTS_TABLE_NAME,
      Key: { id },
    }).promise();

    event = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!event) {
    throw new createError.NotFound(`Event with ID "${id}" not found!`);
  }

  return event;
}

async function getEventById(event, context) {
  const { id } = event.pathParameters;
  const _event = await getEvent(id);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(_event),
  };
}

export const handler = getEventById;


