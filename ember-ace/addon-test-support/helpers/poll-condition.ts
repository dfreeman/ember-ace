import RSVP from 'rsvp';

export default async function pollCondition<T>(
  message: string,
  callback: () => T | PromiseLike<T>,
  { maxTries = 50, interval = 5 } = {}
) {
  for (let tries = 0; tries < maxTries; tries++) {
    try {
      const result = callback();
      if (result) {
        return result;
      }
    } catch (e) {
      // If the callback explodes, consider that a failure of the condition
    }

    await new RSVP.Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition failed to come true: ${message}`);
}
