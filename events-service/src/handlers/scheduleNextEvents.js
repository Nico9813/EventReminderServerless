import createError from 'http-errors';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getOpenEvents(){
    const params = {
        TableName: process.env.EVENTS_TABLE_NAME,
        IndexName: 'statusAndNextTime',
        KeyConditionExpression: '#status = :status AND nextTime >= :now',
        ExpressionAttributeValues: {
            ':now': new Date().toISOString(),
            ':status': 'OPEN'
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    }

    const result = await dynamodb.query(params).promise()
    return result.Items;
}

function getHoursDif(eventType){
    const hoursToAdd = {
        'SINGLE': 0,
        'HOURLY': 1,
        'DAILY': 24,
        'WEEKLY': 24 * 7,
    }

    return hoursToAdd[eventType]
}

async function reScheduleEvent(event){
    const { id, nextTime, eventType, endingAt } = event

    let nextEventTime = new Date(nextTime)
    const dt = getHoursDif(eventType)
    nextEventTime.setHours(nextEventTime.getHours() + dt)

    console.log(nextEventTime.toISOString())
    console.log(endingAt)
    console.log(nextEventTime.toISOString() >= endingAt)

    const params = (nextEventTime.toISOString() >= endingAt || !dt) ?
    {
        TableName: process.env.EVENTS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSE'
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    }
    :
    {
        TableName: process.env.EVENTS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set nextTime = :nextEventTime',
        ExpressionAttributeValues: {
            ':nextEventTime': nextEventTime.toISOString()
        }
    }

    return await dynamodb.update(params).promise()
}

async function scheduleNextEvents(event, context) {
    try {
        const pastEvents = await getOpenEvents()
        const reSchedulePromises = pastEvents.map(event => reScheduleEvent(event))
        await Promise.all(reSchedulePromises)
        return { reScheduleEvents: reSchedulePromises.length}
    } catch (error) {
        throw new createError.InternalServerError(error)
    }
}

export const handler = scheduleNextEvents;


