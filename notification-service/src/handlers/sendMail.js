import AWS from 'aws-sdk';

const ses = new AWS.SES();

async function sendMail(event, context) {
  const record = event.Records[0];
  console.log('record processing', record);

  const email = JSON.parse(record.body);
  const { title, nextTime } = email 

  const params = {
    Source: 'nico.gomez.mbc@gmail.com',
    Destination: {
      ToAddresses: ["nico.gomez.mbc@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: `Your event ${title} is about to start! This event was scheduled to ${nextTime}, hurry up!`,
        },
      },
      Subject: {
        Data: `Event Notification (${title})`,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendMail;