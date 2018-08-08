import { run } from '@ember/runloop';
import RSVP from 'rsvp';

/**
 * Supports Ace's interface for supplying completion information.
 *
 * @private
 * @class CompletionManager
 */
export default class CompletionManager {
  constructor({ suggestCompletions, renderCompletionTooltip }) {
    this._suggestCompletions = suggestCompletions;
    this._renderCompletionTooltip = renderCompletionTooltip;
  }

  // Called by Ace when
  getCompletions(editor, session, position, prefix, callback) {
    const suggestCompletions = this._suggestCompletions;
    if (!suggestCompletions) return callback(null, []);

    let promise;
    try {
      promise = run(() => suggestCompletions(editor, session, position, prefix));
    } catch (error) {
      promise = RSVP.reject(error);
    }

    RSVP.resolve(promise)
      .then(results => callback(null, results))
      .catch(error => callback(error));
  }

  getDocTooltip(result) {
    result.docHTML = this._renderCompletionTooltip.call(null, result);
  }
}
