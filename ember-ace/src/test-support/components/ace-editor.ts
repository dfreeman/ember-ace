import { collection } from 'ember-cli-page-object';
import editorInteraction from '../helpers/editor-interaction';
import line from './ace-editor/line';
import autocomplete from './ace-editor/autocomplete';
import { getter } from 'ember-cli-page-object/macros';
import { settled, waitUntil } from '@ember/test-helpers';
import { Options } from '@ember/test-helpers/wait-until';
import { A } from '@ember/array';
import { Ace } from 'ace-builds';

export default {
  /**
   * The current text value of the entire contents of the editor, with any
   * leading or trailing whitespace removed.
   */
  value: getter(
    editorInteraction((editor) => {
      return editor.getValue();
    })
  ),

  /**
   * Update the current value of this editor.
   */
  setValue: editorInteraction((editor, value: string) => {
    editor.setValue(value, 1);
    editor.renderer.updateFull(true);
    return settled();
  }),

  /**
   * Moves the cursor to the given position.
   */
  moveCursorTo: editorInteraction((editor, row: number, column: number) => {
    editor.moveCursorTo(row, column);
  }),

  /**
   * A collection of lines making up the editor contents.
   */
  lines: collection('.ace_line', line),

  /**
   * The autocomplete dropdown box.
   */
  autocomplete,

  /**
   * Annotations can be added asynchronously by Ace workers or by the component in response to editor events.
   * Use this method to wait for annotations to be added to the editor before making assertions about them.
   *
   * @param expected Optional number of annotations to wait for. If not provided, waits for at least one annotation.
   * @returns A promise that resolves when the expected annotations are present.
   * @throws Will throw an error if the expected annotations are not present within the timeout period.
   */
  async waitForAnnotations(
    this: { annotations: Array<Ace.Annotation> },
    expected?: number,
    options?: Options
  ): Promise<void> {
    let timeout = options?.timeout ?? 600;
    let timeoutMessage =
      options?.timeoutMessage ??
      `Expected ${expected ? expected : '> 1'} annotation(s)`;

    await waitUntil(
      () =>
        expected
          ? this.annotations.length === expected
          : this.annotations.length > 0,
      { timeout, timeoutMessage }
    );
  },

  /**
   * A collection of line gutter annotations.
   */
  annotations: getter(
    editorInteraction((editor) => A(editor.session.getAnnotations()))
  ),

  /**
   * A collection of markers overlaying text.
   */
  frontMarkers: getter(
    editorInteraction((editor) =>
      A(Object.values(editor.session.getMarkers(true)))
    )
  ),

  /**
   * A collection of markers underlaying text.
   */
  backMarkers: getter(
    editorInteraction((editor) =>
      A(Object.values(editor.session.getMarkers(false)))
    )
  ),
};
