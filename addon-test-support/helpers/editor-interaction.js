import { findElementWithAssert } from 'ember-cli-page-object';

export default function editorInteraction(callback) {
  return function () {
    const $pre = findElementWithAssert(this, 'pre');
    return callback.call(this, $pre[0].env.editor, ...arguments);
  };
}
