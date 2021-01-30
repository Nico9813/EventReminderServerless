import AWS from 'aws-sdk';

const ses = new AWS.SES();

async function sendMail(event, context) {
  const record = event.Records[0];
  console.log('record processingg', record.body);

  const email = JSON.parse(record.body);
  
  const { subject, recipient, body } = email 

  const params = {
    Source: "nico.gomez.mbc@gmail.com",
    Destination: {
      ToAddresses: recipient,    
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
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