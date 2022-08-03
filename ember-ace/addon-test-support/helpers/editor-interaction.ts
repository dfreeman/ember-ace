/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ace } from 'ace-builds';
import { Component } from 'ember-cli-page-object/-private';
import { findElementWithAssert } from 'ember-cli-page-object/extend';

export type EditorWithPrivateStuff = Ace.Editor & { completer: any };

export default function editorInteraction<Args extends Array<unknown>, T>(
  callback: (
    this: Component<never>,
    editor: EditorWithPrivateStuff,
    ...args: Args
  ) => T
): (this: Component<any>, ...args: Args) => T {
  return function (...args) {
    const $pre = findElementWithAssert(this, 'pre')[0] as unknown as {
      env: { editor: EditorWithPrivateStuff };
    };

    return callback.call(this as never, $pre.env.editor, ...args);
  };
}
