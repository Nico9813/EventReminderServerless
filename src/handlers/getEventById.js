async function getEventById(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'getEventById from https://codingly.io' }),
  };
}

export const handler = getEventById;


