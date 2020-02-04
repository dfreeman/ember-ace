import Component from '@ember/component';
import { computed } from '@ember/object';
import { map } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { warn } from '@ember/debug';
import { tryInvoke } from '@ember/utils';
import CompletionManager from 'ember-ace/utils/completion-manager';
import layout from 'ember-ace/templates/components/ember-ace';
import ace from 'ember-ace';

export default Component.extend({
  layout,

  mode: undefined,
  theme: undefined,
  useSoftTabs: true,
  tabSize: 2,
  useWrapMode: false,
  highlightActiveLine: true,
  showPrintMargin: true,
  printMarginColumn: 80,
  showInvisibles: false,
  readOnly: false,
  showLineNumbers: true,
  showGutter: true,
  overlays: null,

  maxLines: undefined,
  minLines: undefined,

  enableDefaultAutocompletion: false,
  enableLiveAutocompletion: undefined,
  enableBasicAutocompletion: computed('enableDefaultAutocompletion', 'suggestCompletions', function() {
    const enableDefault = this.get('enableDefaultAutocompletion');
    const suggestCompletions = this.get('suggestCompletions');
    if (enableDefault || suggestCompletions) {
      return HAS_LANGUAGE_TOOLS || emitLanguageToolsWarning();
    }
    return undefined;
  }),

  lines: computed({
    /* eslint-disable-next-line ember/require-return-from-computed */
    set(key, value) {
      this.set('minLines', value);
      this.set('maxLines', value);
    }
  }),

  markers: map('overlays', function(overlay) {
    return {
      class: `ember-ace-${overlay.type} ${overlay.class || ''}`,
      range: overlay.range,
      inFront: overlay.hasOwnProperty('inFront') ? overlay.inFront : true,
    };
  }),

  annotations: map('overlays', function(overlay) {
    return {
      type: overlay.type,
      text: overlay.text,
      row: overlay.range.start.row,
    };
  }),

  init() {
    this._super(...arguments);
    this._silenceUpdates = false;
  },

  didInsertElement() {
    this._super();
    this._instantiateEditor();
  },

  willDestroyElement() {
    this._super();
    this._destroyEditor();
  },

  didReceiveAttrs() {
    this._super();
    this._syncAceProperties();
  },

  _instantiateEditor() {
    const editor = this.editor = ace.edit(this.element.querySelector('[data-ember-ace]'));

    this._syncAceProperties();

    // Avoid a deprecation warning from Ace
    editor.$blockScrolling = Infinity;
    editor.completers = this._buildCompleters(editor);

    const originalSetValue = editor.setValue;
    editor.setValue = (...args) => {
      const update = this.get('update');

      // Ace implements document.setValue by first removing and then inserting,
      // so silence regular updates here, and instead call update directly
      this._withUpdatesSilenced(() => {
        originalSetValue.call(editor, ...args);
      })

      if (update && !this._silenceUpdates) {
        run(() => update(editor.session.getValue()));
      }
    }

    editor.getSession().on('change', (event, session) => {
      const update = this.get('update');

      if (update && !this._silenceUpdates) {
        run(() => update(session.getValue()));
      }
    });

    if (this.get('ready')) {
      this.get('ready')(editor);
    }
  },

  _syncAceProperties() {
    if (!this.editor) return;

    const oldValues = this.getWithDefault('_previousAceValues', {});
    const newValues = this.getProperties(ACE_PROPERTIES);

    this.set('_previousAceValues', newValues);

    // Don't trigger the update action as a result of value syncing
    this._withUpdatesSilenced(() => {
      Object.keys(newValues).forEach((key) => {
        if (oldValues[key] !== newValues[key]) {
          this._syncAceProperty(key, newValues[key]);
        }
      });
    });

    // Render within this run loop, for consistency with Ember's normal component rendering flow
    /* eslint-disable-next-line ember/no-incorrect-calls-with-inline-anonymous-functions */
    run.scheduleOnce('render', this, () => this.editor.renderer.updateFull(true));
  },

  _syncAceProperty(key, value) {
    const handler = ACE_HANDLERS[key];
    const { editor } = this;

    if (handler === 'editor') {
      editor.setOption(key, value);
    } else if (handler === 'session') {
      editor.session.setOption(key, value);
    } else if (handler === 'renderer') {
      editor.renderer.setOption(key, value);
    } else if (typeof handler === 'function') {
      handler.call(this, editor, value);
    }
  },

  _withUpdatesSilenced(callback) {
    const previous = this._silenceUpdates;
    try {
      this._silenceUpdates = true;
      callback();
    } finally {
      this._silenceUpdates = previous;
    }
  },

  _buildCompleters(editor) {
    const includeDefaults = this.get('enableDefaultAutocompletion');
    const completers = (includeDefaults && editor.completers) || [];
    return [this._buildCompletionManager(), ...completers];
  },

  _buildCompletionManager() {
    const suggestCompletions = (...params) => run(() => tryInvoke(this, 'suggestCompletions', params));
    const renderCompletionTooltip = (suggestion) => {
      run(() => this.set('suggestionToRender', suggestion));
      const rendered = this.element.querySelector('[data-rendered-suggestion]');
      const html = rendered ? rendered.innerHTML.trim() : null;
      run(() => this.set('suggestionToRender', null));
      return html;
    };

    return new CompletionManager({ suggestCompletions, renderCompletionTooltip });
  },

  _destroyEditor() {
    if (this.editor) {
      const { completer } = this.editor;
      if (completer) {
        // autocomplete options may have been initialized without a popup ever rendering
        if (completer.popup) {
          completer.popup.container.remove();
          completer.popup.destroy();
        }
        completer.detach();
      }

      this.editor.destroy();
      this.editor = null;
    }
  }
});

const ACE_HANDLERS = Object.freeze({
  theme: 'editor',
  highlightActiveLine: 'editor',
  showInvisibles: 'editor',
  showPrintMargin: 'editor',
  printMarginColumn: 'editor',
  readOnly: 'editor',
  minLines: 'editor',
  maxLines: 'editor',
  showLineNumbers: 'editor',

  enableBasicAutocompletion: 'editor',
  enableLiveAutocompletion: 'editor',

  tabSize: 'session',
  useSoftTabs: 'session',

  showGutter: 'renderer',

  markers(editor, newValue) {
    (this._markerIds || []).forEach(id => editor.session.removeMarker(id));

    if (!newValue) return;

    this._markerIds = newValue.map(({ range, class: className, type = 'text', inFront = true }) => {
      return editor.session.addMarker(range, className, type, inFront);
    });
  },

  annotations(editor, newValue) {
    run.schedule('render', this, () => editor.session.setAnnotations(newValue));
  },

  useWrapMode(editor, newValue) {
    editor.session.setUseWrapMode(newValue);
  },

  mode(editor, newValue) {
    editor.session.setMode(newValue);
  },

  value(editor, newValue) {
    if (editor.getValue() !== newValue) {
      editor.setValue(newValue, -1);
    }
  }
});

const ACE_PROPERTIES = Object.freeze(Object.keys(ACE_HANDLERS));
const HAS_LANGUAGE_TOOLS = !!ace.require('ace/ext/language_tools');

function emitLanguageToolsWarning() {
  warn(
    "You've defined a `suggestCompletions` action, but the `language_tools` extension isn't present. " +
    "To use autocomplete, you must have `exts: ['language_tools']` in your ember-ace build config.",
    false,
    { id: 'ember-ace.missing-language-tools' }
  );
}
