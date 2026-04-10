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
    let el = findElementWithAssert(this)[0];
    let pre = (el?.closest('pre') ?? el?.querySelector('pre')) as any;
    if (!pre?.env?.editor) {
      throw new Error('Could not locate root Ace editor element');
    }

    return callback.call(this as never, pre.env.editor, ...args);
  };
}
