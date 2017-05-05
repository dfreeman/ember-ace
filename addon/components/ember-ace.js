import Ember from 'ember';
import ace from 'ember-ace';

const {
  run,
  computed,
  Component,
} = Ember;

export default Component.extend({
  tagName: 'pre',

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

  maxLines: undefined,
  minLines: undefined,

  lines: computed({
    set(key, value) {
      this.set('minLines', value);
      this.set('maxLines', value);
    }
  }),

  init() {
    this._super(...arguments);
    this.markers = this.markers || [];
    this.annotations = this.annotations || [];
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
    const editor = this.editor = ace.edit(this.element);

    // Avoid a deprecation warning from Ace
    editor.$blockScrolling = Infinity;

    this._syncAceProperties();

    editor.getSession().on('change', (event, session) => {
      const update = this.get('update');
      if (update) {
        Ember.run(() => update(session.getValue()));
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

    Object.keys(newValues).forEach((key) => {
      if (oldValues[key] !== newValues[key]) {
        this._syncAceProperty(key, newValues[key]);
      }
    });

    // Render within this run loop, for consistency with Ember's normal component rendering flow
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

  _destroyEditor() {
    if (this.editor) {
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
  showLineNumbers: 'renderer',
  readOnly: 'editor',
  minLines: 'editor',
  maxLines: 'editor',

  tabSize: 'session',
  useSoftTabs: 'session',

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
