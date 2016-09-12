import { collection, findElementWithAssert } from 'ember-cli-page-object';
import line from './ember-ace/line';
import marker from './ember-ace/marker';
import annotation from './ember-ace/annotation';

export default {
  /**
   * The current text value of the entire contents of the editor, with any
   * leading or trailing whitespace removed.
   */
  value: {
    isDescriptor: true,
    get() {
      // Can't use ECPO's text() macro because it squashes newlines, even with normalize: false
      const contentElement = findElementWithAssert(this, '.ace_text-layer')[0];
      return contentElement.innerText.trim();
    }
  },

  /**
   * Update the current value of this editor.
   */
  setValue(value) {
    const textarea = findElementWithAssert(this, 'pre')[0];
    textarea.env.editor.setValue(value);
    textarea.env.editor.renderer.updateFull(true);
  },

  /**
   * A collection of lines making up the editor contents.
   */
  lines: collection({
    itemScope: '.ace_line',
    item: line
  }),

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
