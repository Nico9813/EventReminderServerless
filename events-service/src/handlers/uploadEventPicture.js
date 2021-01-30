import AWS from 'aws-sdk';
import createError from 'http-errors';
import { setEventPicture } from '../lib/setEventPicture';
import { getEvent } from './getEventById';

const s3 = new AWS.S3();

async function uploadPictureToS3(key, body){
    const result = await s3.upload({
        Bucket: process.env.EVENTS_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }).promise()
    return result;
}

async function uploadEventPicture(event, context) {

    const { id } = event.pathParameters;
    const _event = await getEvent(id)
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    let updatedEvent;

    try {
        const pictureUrl = await uploadPictureToS3(_event.id + '.jpg', buffer);
        updatedEvent = await setEventPicture(id, pictureUrl.Location)
    } catch (error) {
        console.log(error)
        throw new createError.InternalServerError(error)
    }   

    return {
        statusCode: 200,
        body: JSON.stringify(updatedEvent),
    };
}

export const handler = uploadEventPicture;


