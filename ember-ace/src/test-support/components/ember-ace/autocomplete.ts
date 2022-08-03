import { waitUntil } from '@ember/test-helpers';
import editorInteraction from '../../helpers/editor-interaction';
import { text, collection, isVisible, Collection } from 'ember-cli-page-object';
import { Component } from 'ember-cli-page-object/-private';
import { getter } from 'ember-cli-page-object/macros';

/**
 * A suggestion in the autocomplete list, with a caption on the left
 * and metadata on the right.
 */
export const suggestion = {
  caption: text('.ace_'),
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

export type Autocomplete = Component<{
  isVisible: boolean;
  focusedIndex: number;
  suggestions: Collection<typeof suggestion>;
}>;

export default {
  isVisible: isVisible('.ace_autocomplete', { testContainer: 'body' }),

  /**
   * Trigger a request for autocomplete suggestions.
   */
  trigger: editorInteraction(function (this: Autocomplete, editor) {
    editor.execCommand('startAutocomplete', undefined);
    return waitUntil(() => this.isVisible);
  }),

  /**
   * Clear the open autocomplete suggestions list, if present.
   */
  close: editorInteraction((editor) => editor.completer.detach()),

  /**
   * Focus the next suggestion in the list.
   */
  focusNext: editorInteraction(function (this: Autocomplete, editor) {
    const index = this.focusedIndex;
    editor.completer.goTo('down');
    return waitUntil(() => this.focusedIndex === index + 1);
  }),

  /**
   * Focus the previous suggestion in the list.
   */
  focusPrevious: editorInteraction(function (this: Autocomplete, editor) {
    const index = this.focusedIndex;
    editor.completer.goTo('up');
    return waitUntil(() => this.focusedIndex === index - 1);
  }),

  /**
   * Select the highlighted suggestion for insertion.
   */
  selectFocused: editorInteraction((editor) => editor.completer.insertMatch()),

  /**
   * The index of the currently-highlighted selection
   */
  focusedIndex: editorInteraction((editor) => {
    return editor.completer.popup.getRow();
  }),

  /**
   * The currently-highlighted suggestion.
   */
  focusedSuggestion: getter(function (this: Autocomplete) {
    return this.suggestions.objectAt(this.focusedIndex);
  }),

  /**
   * The list of active suggestions.
   */
  suggestions: collection(
    '.ace_autocomplete .ace_line',
    Object.assign(
      {
        resetScope: true,
        testContainer: 'body',
      },
      suggestion
    )
  ),

  /**
   * The active suggestion tooltip.
   */
  tooltip,
};
