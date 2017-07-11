import { text, findElementWithAssert } from 'ember-cli-page-object';

export default {
  /**
   * The text value of this token
   */
  text: text(null, { normalize: false }),

  /**
   * The type of this token, as specified by the Ace tokenizer,
   * e.g. `variable` or `punctuation.operator`.
   *
   * See https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#common-tokens
   */
  type: {
    isDescriptor: true,
    get() {
      const $el = findElementWithAssert(this);
      const classes = $el.attr('class').split(/\s+/);
      return classes.map(cls => cls.replace(/^ace_/, '')).join('.');
    }
  }
};
