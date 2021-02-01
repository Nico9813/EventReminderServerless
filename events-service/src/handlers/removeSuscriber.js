import createError from 'http-errors';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function removeSuscriber(event, context) {
    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;

    const params = {
        TableName: process.env.EVENTS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'DELETE suscribers :removed_suscriber',
        ExpressionAttributeValues: {
            ':removed_suscriber': dynamodb.createSet(email),
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedEvent;

    try {
        const result = await dynamodb.update(params).promise();
        updatedEvent = result.Attributes;
    } catch (error) {
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(updatedEvent),
    };
}

export const handler = removeSuscriber;


