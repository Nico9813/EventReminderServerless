import AWS from 'aws-sdk';
import createError from 'http-errors';
import { getEvent } from './getEventById';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteEvent(event, context) {
    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;
    
    const _event = await getEvent(id);

    if(_event.createdBy !== email){
        throw new createError.Forbidden(`You [${email}] are not the owner of this event [${_event.createdBy}]`)
    }

    try {
        await dynamodb.delete({
            TableName: process.env.EVENTS_TABLE_NAME,
            Key: { id },
        }).promise()
    } catch (error) {
        throw new createError.InternalServerError(error)
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(_event),
    };
}

export const handler = deleteEvent;


