import { collection } from 'ember-cli-page-object';
import editorInteraction from 'ember-ace/test-support/helpers/editor-interaction';
import line from './ember-ace/line';
import marker from './ember-ace/marker';
import annotation from './ember-ace/annotation';
import autocomplete from './ember-ace/autocomplete';
import { getter } from 'ember-cli-page-object/macros';

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
   * A collection of line gutter annotations.
   */
  annotations: collection('.ace_gutter-cell:not([class$=" "])', annotation),

  /**
   * A collection of markers overlaying text.
   */
  frontMarkers: collection('.ace_layer:nth-child(4) .ace_start', marker),

  /**
   * A collection of markers underlaying text.
   */
  backMarkers: collection(
    '.ace_layer:nth-child(2) .ace_start:not(.ace_selection)',
    marker
  ),
};
