import RSVP from 'rsvp';

// error message source

export default async function pollCondition(message, callback, {
  maxTries = 50,
  interval = 5,
} = {}) {

  for (let tries = 0; tries < maxTries; tries++) {
    try {
      const result = callback();
      if (result) {
        return result;
      }
    } catch (e) {
      // If the callback explodes, consider that a failure of the condition
    }

    await new RSVP.Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Condition failed to come true: ${message}`);
}
