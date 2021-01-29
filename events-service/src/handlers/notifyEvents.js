import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

async function getOpenEvents() {
    let now = new Date()
    let nearTime = new Date()
    nearTime.setMinutes(now.getMinutes() + 30)

    const params = {
        TableName: process.env.EVENTS_TABLE_NAME,
        IndexName: 'statusAndNextTime',
        KeyConditionExpression: '#status = :status AND nextTime BETWEEN :now AND :nearTime',
        ExpressionAttributeValues: {
            ':now':now.toISOString(),
            ':nearTime': nearTime.toISOString(),
            ':status': 'OPEN'
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    }

    const result = await dynamodb.query(params).promise()
    return result.Items;
}

async function sendNotification(event){
    return await sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify(event)
    }).promise()
}

async function notifyEvents(event, context) {
    try {
        const nearEvents = await getOpenEvents()
        console.log(nearEvents)
        const nearEventsPromises = nearEvents.map( event => sendNotification(event))
        await Promise.all(nearEventsPromises)
        return {
            eventsNotified: nearEvents.length,
        };
    } catch (error) {
        console.log(error)
    }
}

export const handler = notifyEvents;


