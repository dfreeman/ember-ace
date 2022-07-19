import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Range } from 'ember-ace';

export default class ApplicationController extends Controller {
  @tracked value = 'one two three\nfour five size\nseven eight nine';

  @tracked highlightActiveLine = true;
  @tracked showPrintMargin = true;
  @tracked readOnly = false;

  @tracked tabSize = 2;
  @tracked useSoftTabs = true;
  @tracked wrap = true;
  @tracked showInvisibles = true;
  @tracked showGutter = true;

  @tracked theme = 'ace/theme/textmate';
  @tracked themes = [
    'ace/theme/textmate',
    'ace/theme/ambiance',
    'ace/theme/chaos',
  ];

  @tracked overlayType = 'warning';
  @tracked overlayText = 'by the way';
  @tracked overlayStartRow = 0;
  @tracked overlayStartCol = 4;
  @tracked overlayEndRow = 0;
  @tracked overlayEndCol = 7;

  get overlays() {
    return [
      {
        type: this.overlayType,
        text: this.overlayText,
        range: new Range(
          this.overlayStartRow,
          this.overlayStartCol,
          this.overlayEndRow,
          this.overlayEndCol
        ),
      },
    ];
  }

  @action syncInputValue(key, { target }) {
    this[key] = target.type === 'checkbox' ? target.checked : target.value;
  }

  @action suggestCompletions(editor, session, position, prefix) {
    return [
      {
        value: prefix + '111',
        snippet: 'one',
        meta: 'MetaOne',
        caption: 'The one',
        score: 1,
      },
      {
        value: prefix + '222',
        snippet: 'two',
        meta: 'MetaTwo',
        caption: 'The two',
        score: 2,
      },
    ];
  }
}
