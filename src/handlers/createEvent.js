async function createEvent(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'createEvent from https://codingly.io' }),
  };
}

export const handler = createEvent;


