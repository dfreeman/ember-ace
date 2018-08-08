import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { Range } from 'ember-ace';

export default Controller.extend({
  value: 'one two three\nfour five size\nseven eight nine',

  highlightActiveLine: true,
  showPrintMargin: true,
  readOnly: false,

  tabSize: 2,
  useSoftTabs: true,
  wrap: true,
  showInvisibles: true,
  showGutter: true,

  theme: 'ace/theme/textmate',
  themes: Object.freeze([
    'ace/theme/textmate',
    'ace/theme/ambiance',
    'ace/theme/chaos',
  ]),

  overlay: Object.freeze({
    type: 'warning',
    text: 'by the way',
    range: new Range(0, 4, 0, 7),
  }),

  overlays: computed('overlay.{type,text}', 'overlay.range.{start,end}.{row,column}', function() {
    return [this.get('overlay')];
  }),

  actions: {
    suggestCompletions(editor, session, position, prefix) {
      return [
        { value: prefix + '111', snippet: 'one', meta: 'MetaOne', caption: 'The one', score: 1 },
        { value: prefix + '222', snippet: 'two', meta: 'MetaTwo', caption: 'The two', score: 2 },
      ];
    }
  }
});
