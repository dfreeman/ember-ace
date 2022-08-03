import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, TestContext, waitUntil } from '@ember/test-helpers';
import { create } from 'ember-cli-page-object';
import aceComponent from 'ember-ace/test-support/components/ember-ace';
import hbs from 'htmlbars-inline-precompile';
import { Component } from 'ember-cli-page-object/-private';
import { Ace, Range } from 'ace-builds';
import { tracked } from '@glimmer/tracking';
import sinon from 'sinon';

class State {
  @tracked public value = '';
  @tracked public options: Partial<Ace.EditorOptions> = {
    minLines: 1,
    maxLines: 10,
  };
}

interface AceTestContext extends TestContext {
  component: Component<typeof aceComponent>;
  state: State;
  change: sinon.SinonSpy;
  ready?: (editor: Ace.Editor) => void;
}

module('Integration | Component | <AceEditor />', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (this: AceTestContext) {
    this.component = create(aceComponent);
    this.state = new State();
    this.change = sinon.spy();
  });

  test('rendering a given value', async function (this: AceTestContext, assert) {
    this.state.value = 'function() {\n  console.log("hi");\n}';
    await render(hbs`
      <AceEditor @options={{this.state.options}} @value={{this.state.value}} />
    `);

    assert.strictEqual(this.component.lines.length, 3);
    assert.strictEqual(this.component.value, this.state.value);

    this.state.value = '// nevermind';
    await settled();

    assert.strictEqual(this.component.lines.length, 1);
    assert.strictEqual(this.component.value, this.state.value);
  });

  test('leading, trailing and internal whitespace', async function (this: AceTestContext, assert) {
    this.state.value = '\n\na\n  \nb\n\n';
    await render(hbs`
      <AceEditor @options={{this.state.options}} @value={{this.state.value}} />
    `);

    assert.strictEqual(this.component.lines.length, 7);
    assert.strictEqual(this.component.value, this.state.value);
  });

  test('internal value updates', async function (this: AceTestContext, assert) {
    await render(hbs`
      <AceEditor @options={{this.state.options}} @update={{this.change}} />
    `);

    this.component.setValue('hello');

    assert.ok(this.change.calledWith('hello'));
    assert.strictEqual(this.change.callCount, 1);
    assert.strictEqual(this.component.value, 'hello');
  });

  test('internal value updates with initial value', async function (this: AceTestContext, assert) {
    await render(hbs`
      <AceEditor @options={{this.state.options}} @update={{this.change}} />
    `);

    this.component.setValue('two');
    assert.strictEqual(this.change.callCount, 1);
    assert.strictEqual(this.component.value, 'two');

    this.component.setValue('');
    assert.strictEqual(this.change.callCount, 2);
    assert.strictEqual(this.component.value, '');
  });

  test('external value updates', async function (this: AceTestContext, assert) {
    this.state.value = 'one';

    await render(hbs`
      <AceEditor @options={{this.state.options}} @value={{this.state.value}} @update={{this.change}} />
    `);

    this.state.value = 'two';
    await settled();

    assert.strictEqual(this.change.callCount, 0);
    assert.strictEqual(this.component.value, 'two');
  });

  test('setting editor options', async function (this: AceTestContext, assert) {
    this.state.options = { ...this.state.options, theme: 'ace/theme/ambiance' };

    await render(hbs`
      <AceEditor @options={{this.state.options}} @value={{this.state.value}} @update={{this.change}} />
    `);

    assert.dom('.ace_editor').hasClass('ace-ambiance');

    this.state.options = { ...this.state.options, theme: 'ace/theme/chaos' };
    await settled();

    assert.dom('.ace_editor').hasClass('ace-chaos');
  });

  test('basic page objects for markers and annotations', async function (this: AceTestContext, assert) {
    let editor!: Ace.Editor;
    this.ready = (e) => (editor = e);
    this.state.value = 'one\ntwo\nthree\n';

    await render(hbs`
      <AceEditor @options={{this.state.options}} @ready={{this.ready}} @value={{this.state.value}} />
    `);

    editor.session.setAnnotations([{ type: 'error', text: 'Uh oh', row: 0 }]);
    editor.session.addMarker(
      new Range(0, 1, 1, 1),
      'neat-front-thing',
      'text',
      true
    );
    editor.session.addMarker(
      new Range(1, 2, 2, 4),
      'cool-back-thing',
      'text',
      false
    );

    await waitUntil(
      () =>
        this.component.annotations.length === 1 &&
        this.component.backMarkers.length === 1 &&
        this.component.frontMarkers.length === 1
    );

    assert.strictEqual(this.component.annotations[0]?.type, 'error');
    assert.strictEqual(this.component.annotations[0]?.row, 0);
    assert.strictEqual(this.component.backMarkers[0]?.type, 'cool-back-thing');
    assert.strictEqual(
      this.component.frontMarkers[0]?.type,
      'neat-front-thing'
    );
  });

  test('completions page object', async function (this: AceTestContext, assert) {
    let { autocomplete } = this.component;
    let editor!: Ace.Editor;
    this.ready = (e) => (editor = e);
    this.state.value = 'foo\nbar\nf';

    await render(hbs`
      <AceEditor @options={{this.state.options}} @ready={{this.ready}} @value={{this.state.value}} />
    `);

    editor.setOptions({ enableBasicAutocompletion: true });

    this.component.moveCursorTo(2, 1);

    await autocomplete.trigger();
    await waitUntil(() => autocomplete.suggestions.length === 1);

    assert.deepEqual(autocomplete.suggestions.mapBy('caption'), ['oo']);
  });
});
