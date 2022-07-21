import { text } from 'ember-cli-page-object';
import { Component } from 'ember-cli-page-object/-private';
import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export default {
  /**
   * The text value of this token
   */
  text: text(undefined, { normalize: false }),

  /**
   * The type of this token, as specified by the Ace tokenizer,
   * e.g. `variable` or `punctuation.operator`.
   *
   * See https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#common-tokens
   */
  type: getter(function (this: Component) {
    const $el = findElementWithAssert(this);
    const classes = $el.attr('class')!.split(/\s+/);
    return classes.map((cls) => cls.replace(/^ace_/, '')).join('.');
  }),
};
