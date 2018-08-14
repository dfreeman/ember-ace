import pollCondition from 'ember-ace/test-support/helpers/poll-condition';
import editorInteraction from 'ember-ace/test-support/helpers/editor-interaction';
import { text, collection, is, isVisible } from 'ember-cli-page-object';

/**
 * A suggestion in the autocomplete list, with a caption on the left
 * and metadata on the right.
 */
export const suggestion = {
  // selected: is('.ace_selected'),
  selected: is('.ace_active-line'),

  caption: {
    isDescriptor: true,
    get() {
      return this.text.slice(0, -this.meta.length);
    }
  },

  // meta: text('.ace_rightAlignedText'),
  meta: text('.ace_completion-meta'),
};

/**
 * A rendered tooltip for the focused suggestion in the autocomplete dropdown.
 */
export const tooltip = {
  resetScope: true,
  testContainer: 'body',
  scope: '.ace_doc-tooltip',
};

export default {
  isVisible: isVisible('.ace_autocomplete', { testContainer: 'body' }),

  /**
   * Trigger a request for autocomplete suggestions.
   */
  trigger: editorInteraction(function(editor) {
    editor.execCommand('startAutocomplete');
    return pollCondition('autocomplete visible', () => this.isVisible);
  }),

  /**
   * Clear the open autocomplete suggestions list, if present.
   */
  close: editorInteraction(editor => editor.completer.detach()),

  /**
   * Focus the next suggestion in the list.
   */
  focusNext: editorInteraction(function(editor) {
    const index = this.focusedIndex;
    console.log(index)
    editor.completer.goTo('down');
    debugger
    return pollCondition('next suggestion focused', () => this.focusedIndex === index + 1);
  }),

  /**
   * Focus the previous suggestion in the list.
   */
  focusPrevious: editorInteraction(function(editor) {
    const index = this.focusedIndex;
    editor.completer.goTo('up');
    return pollCondition('previous suggestion focused', () => this.focusedIndex === index - 1);
  }),

  /**
   * Select the highlighted suggestion for insertion.
   */
  selectFocused: editorInteraction(editor => editor.completer.insertMatch()),

  /**
   * The index of the currently-highlighted selection
   */
  focusedIndex: {
    isDescriptor: true,
    get() {
      for (let i = 0, len = this.suggestions().count; i < len; i++) {
        if (this.suggestions(i).selected) {
          return i;
        }
      }
      return -1;
    }
  },

  /**
   * The currently-highlighted suggestion.
   */
  focusedSuggestion: {
    isDescriptor: true,
    get() {
      return this.suggestions(this.focusedIndex);
    }
  },

  /**
   * The list of active suggestions.
   */
  suggestions: collection({
    resetScope: true,
    testContainer: 'body',
    scope: '.ace_autocomplete',
    itemScope: '.ace_line',
    item: suggestion,
  }),

  /**
   * The active suggestion tooltip.
   */
  tooltip
};
