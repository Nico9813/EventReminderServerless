async function getEvent(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'getEvent from https://codingly.io' }),
  };
}

export const handler = getEvent;


