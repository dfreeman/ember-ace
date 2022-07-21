import Controller from '@ember/controller';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

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

  @action syncInputValue<K extends keyof this>(key: K, { target }: InputEvent) {
    assert(
      'Should be an input of some kind',
      target instanceof HTMLInputElement
    );
    this[key] = (target.type === 'checkbox'
      ? target.checked
      : target.value) as unknown as this[K];
  }
}
