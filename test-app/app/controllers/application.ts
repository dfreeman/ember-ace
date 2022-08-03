import Controller from '@ember/controller';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked public value =
    'console.log("hello");\n\n// Intentional syntax error\n2 +';

  @tracked public highlightActiveLine = true;
  @tracked public showPrintMargin = true;
  @tracked public readOnly = false;

  @tracked public tabSize = 2;
  @tracked public useSoftTabs = true;
  @tracked public wrap = true;
  @tracked public showInvisibles = false;
  @tracked public showGutter = true;

  @tracked public theme = 'ace/theme/textmate';
  @tracked public themes = [
    'ace/theme/textmate',
    'ace/theme/ambiance',
    'ace/theme/chaos',
  ];

  @action public syncInputValue<K extends keyof this>(
    key: K,
    { target }: InputEvent
  ): void {
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
