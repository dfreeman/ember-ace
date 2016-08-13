import Ember from 'ember';
import { Range } from 'ember-ace';

export default Ember.Controller.extend({
  value: 'one two three\nfour five size\nseven eight nine',

  highlightActiveLine: true,
  showPrintMargin: true,
  readOnly: false,

  tabSize: 2,
  useSoftTabs: true,
  wrap: true,
  showInvisibles: true,

  theme: 'ace/theme/textmate',
  themes: [
    'ambiance',
    'tomorrow_night_eighties',
    'chaos'
  ].map(theme => `ace/theme/${theme}`),

  markers: [
    { class: 'editor-error', range: new Range(1, 6, 2, 5) }
  ],

  annotations: [
    { row: 1, text: 'hello', type: 'warning' }
  ]
});
