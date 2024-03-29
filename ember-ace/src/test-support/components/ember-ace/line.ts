import { text, collection } from 'ember-cli-page-object';
import token from './token';

export default {
  /**
   * The text value of this entire line.
   */
  text: text(undefined, { normalize: false }),

  /**
   * A collection of tokens from which this line is composed.
   */
  tokens: collection('>', token),
};
