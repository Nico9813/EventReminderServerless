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

function sendNotification(event){

    const { suscribers = [], title, nextTime } = event

    console.log(title, suscribers.values, nextTime)

    return sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: `Event Notification (${title})`,
                recipient: suscribers,
                body: `Your event ${title} is about to start! This event was scheduled to ${nextTime}, HURRY UP!`
            })
        }).promise()
}

async function notifyEvents(event, context) {
    try {
        const nearEvents = await getOpenEvents()
        console.log(nearEvents)
        const nearEventsPromises = nearEvents.map(event => sendNotification(event))
        await Promise.all(nearEventsPromises)
        return {
            usersNotified: nearEventsPromises.length,
        };
    } catch (error) {
        console.log(error)
    }
}

export const handler = notifyEvents;


