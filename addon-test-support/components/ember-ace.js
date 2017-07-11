import { collection } from 'ember-cli-page-object';
import editorInteraction from 'ember-ace/test-support/helpers/editor-interaction';
import line from './ember-ace/line';
import marker from './ember-ace/marker';
import annotation from './ember-ace/annotation';
import autocomplete from './ember-ace/autocomplete';

export default {
  /**
   * The current text value of the entire contents of the editor, with any
   * leading or trailing whitespace removed.
   */
  value: {
    isDescriptor: true,
    get: editorInteraction((editor) => {
      return editor.getValue();
    })
  },

  /**
   * Update the current value of this editor.
   */
  setValue: editorInteraction((editor, value) => {
    editor.setValue(value, 1);
    editor.renderer.updateFull(true);
  }),

  /**
   * Moves the cursor to the given position.
   */
  moveCursorTo: editorInteraction((editor, row, column) => {
    editor.moveCursorTo(row, column);
  }),

  /**
   * A collection of lines making up the editor contents.
   */
  lines: collection({
    itemScope: '.ace_line',
    item: line
  }),

  /**
   * The autocomplete dropdown box.
   */
  autocomplete,

  /**
   * A collection of line gutter annotations.
   */
  annotations: collection({
    itemScope: '.ace_gutter-cell:not([class$=" "])',
    item: annotation
  }),

  /**
   * A collection of markers overlaying text.
   */
  frontMarkers: collection({
    scope: '.ace_layer:nth-child(4)',
    itemScope: '.ace_start',
    item: marker
  }),

  /**
   * A collection of markers underlaying text.
   */
  backMarkers: collection({
    scope: '.ace_layer:nth-child(2)',
    itemScope: '.ace_start:not(.ace_selection)',
    item: marker
  })
};
