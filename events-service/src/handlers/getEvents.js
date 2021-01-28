import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getEvent(event, context) {
  const { status } = event.queryStringParameters;
  let events;

  const params = {
    TableName: process.env.EVENTS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try {
    const result = await dynamodb.query(params).promise();
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


