import Controller from '@ember/controller';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked value = 'console.log("hello");\n\n// Intentional syntax error\n2 +';

  @tracked highlightActiveLine = true;
  @tracked showPrintMargin = true;
  @tracked readOnly = false;

  @tracked tabSize = 2;
  @tracked useSoftTabs = true;
  @tracked wrap = true;
  @tracked showInvisibles = false;
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
      target instanceof HTMLInputElement || target instanceof HTMLSelectElement
    );

    let value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    this[key] = value as unknown as this[K];
  }
}
