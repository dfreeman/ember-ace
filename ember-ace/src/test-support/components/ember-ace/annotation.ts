import { getter } from 'ember-cli-page-object/macros';
import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { Component } from 'ember-cli-page-object/-private';
import editorInteraction from '../../helpers/editor-interaction';

export default {
  /**
   * The type of annotation this is, typically one of 'info', 'warning', or 'error'.
   */
  type: getter(function (this: Component): string {
    let classes = findElementWithAssert(this).attr('class')!.split(/\s+/);
    return classes[classes.length - 1]!.replace(/^ace_/, '');
  }),

  /**
   * The 0-indexed row number of this annotation.
   */
  row: getter(function (this: Component) {
    let el = findElementWithAssert(this)[0]!;
    return [...el.parentElement!.children].indexOf(el);
  }),

  /**
   * The text content of this annotation.
   */
  text: getter(
    editorInteraction(function (this: Component<{ row: number }>, editor) {
      let annotation = editor.session.getAnnotations()[this.row];
      return annotation ? annotation.text : null;
    })
  ),
};
