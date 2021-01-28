import { v4 as uuid } from 'uuid';

async function createEvent(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const newEvent = {
    id: uuid(),
    title,
    eventType: 'DAILY',
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify(newEvent),
  };
}

export const handler = createEvent;


