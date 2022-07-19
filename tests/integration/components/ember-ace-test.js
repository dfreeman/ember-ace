import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import {
  TextMode,
  TextHighlightRules,
  Range
} from 'ember-ace';
import PageObject from 'ember-cli-page-object';
import pollCondition from 'ember-ace/test-support/helpers/poll-condition';
import aceComponent from 'ember-ace/test-support/components/ember-ace';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | ember ace', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.component = PageObject.create(aceComponent);
  });

  test('rendering a given value', async function(assert) {
    this.set('value', 'function() {\n  console.log("hi");\n}');
    await render(hbs`{{ember-ace lines=3 value=this.value}}`);

    assert.equal(this.component.lines.length, 3);
    assert.equal(this.component.value, this.get('value'));

    run(() => this.set('value', '// nevermind'));
    assert.equal(this.component.lines.length, 1);
    assert.equal(this.component.value, this.get('value'));
  });

  test('leading, trailing and internal whitespace', async function(assert) {
    this.set('value', '\n\na\n  \nb\n\n');
    await render(hbs`{{ember-ace lines=10 value=this.value}}`);

    assert.equal(this.component.lines.length, 7);
    assert.equal(this.component.value, this.get('value'));
  });

  test('internal value updates', async function(assert) {
    this.set('change', sinon.spy());
    await render(hbs`{{ember-ace lines=1 update=(action this.change)}}`);

    this.component.setValue('hello');
    assert.ok(this.get('change').calledWith('hello'));
    assert.equal(this.get('change.callCount'), 1);
    assert.equal(this.component.value, 'hello');
  });

  test('internal value updates with initial value', async function(assert) {
    this.set('value', 'one');
    this.set('change', sinon.spy());
    await render(hbs`{{ember-ace lines=1 update=(action this.change)}}`);

    this.component.setValue('two');
    assert.equal(this.get('change.callCount'), 1);
    assert.equal(this.component.value, 'two');

    this.component.setValue('');
    assert.equal(this.get('change.callCount'), 2);
    assert.equal(this.component.value, '');
  });

  test('external value updates', async function(assert) {
    this.set('value', 'one');
    this.set('change', sinon.spy());
    await render(hbs`{{ember-ace lines=1 value=this.value update=(action this.change)}}`);

    run(() => this.set('value', 'two'));
    assert.equal(this.get('change.callCount'), 0);
    assert.equal(this.component.value, 'two');
  });

  test('setting a theme', async function(assert) {
    this.set('theme', 'ace/theme/ambiance');
    await render(hbs`{{ember-ace theme=this.theme}}`);
    assert.ok(this.$('.ace_editor').is('.ace-ambiance'));

    run(() => this.set('theme', 'ace/theme/chaos'));
    assert.ok(this.$('.ace_editor').is('.ace-chaos'));
  });

  test('annotating lines', async function(assert) {
    this.set('annotations', [{ type: 'warning', row: 1 }]);
    this.set('value', 'hello\nworld');
    await render(hbs`{{ember-ace lines=3 annotations=this.annotations value=this.value}}`);
    assert.equal(this.component.annotations.length, 1);
    assert.equal(this.component.annotations.objectAt(0).type, 'warning');
    assert.equal(this.component.annotations.objectAt(0).row, 1);

    run(() => this.set('annotations', [{ type: 'error', row: 0 }]));
    assert.equal(this.component.annotations.length, 1);
    assert.equal(this.component.annotations.objectAt(0).type, 'error');
    assert.equal(this.component.annotations.objectAt(0).row, 0);

    run(() => this.set('annotations', []));
    assert.equal(this.component.annotations.length, 0);
  });

  test('front range markers', async function(assert) {
    this.set('value', 'hello\neveryone\nin the world');
    this.set('markers', [
      { class: 'foo', range: new Range(0, 0, 1, 1) },
      { class: 'bar', range: new Range(2, 0, 2, 5) }
    ]);
    await render(hbs`{{ember-ace lines=3 markers=this.markers value=this.value}}`);
    assert.equal(this.component.backMarkers.length, 0);
    assert.equal(this.component.frontMarkers.length, 2);
    assert.equal(this.component.frontMarkers.objectAt(0).type, 'foo');
    assert.equal(this.component.frontMarkers.objectAt(0).segmentCount, 2);
    assert.equal(this.component.frontMarkers.objectAt(1).type, 'bar');
    assert.equal(this.component.frontMarkers.objectAt(1).segmentCount, 1);

    run(() => this.set('markers', [{ class: 'baz', range: new Range(1, 0, 1, 1) }]));
    assert.equal(this.component.frontMarkers.length, 1);
    assert.equal(this.component.frontMarkers.objectAt(0).type, 'baz');
    assert.equal(this.component.frontMarkers.objectAt(0).segmentCount, 1);

    run(() => this.set('markers', []));
    assert.equal(this.component.frontMarkers.length, 0);
  });

  test('back range markers', async function(assert) {
    this.set('value', 'hello\neveryone\nin the world');
    this.set('markers', [
      { class: 'foo', range: new Range(0, 0, 1, 1), inFront: false },
      { class: 'bar', range: new Range(2, 0, 2, 5), inFront: false }
    ]);
    await render(hbs`{{ember-ace lines=3 markers=this.markers value=this.value}}`);
    assert.equal(this.component.frontMarkers.length, 0);
    assert.equal(this.component.backMarkers.length, 2);
    assert.equal(this.component.backMarkers.objectAt(0).type, 'foo');
    assert.equal(this.component.backMarkers.objectAt(0).segmentCount, 2);
    assert.equal(this.component.backMarkers.objectAt(1).type, 'bar');
    assert.equal(this.component.backMarkers.objectAt(1).segmentCount, 1);

    run(() => this.set('markers', [{ class: 'baz', range: new Range(1, 0, 1, 1), inFront: false }]));
    assert.equal(this.component.backMarkers.length, 1);
    assert.equal(this.component.backMarkers.objectAt(0).type, 'baz');
    assert.equal(this.component.backMarkers.objectAt(0).segmentCount, 1);

    run(() => this.set('markers', []));
    assert.equal(this.component.backMarkers.length, 0);
  });

  test('overlays', async function(assert) {
    this.set('value', 'hellow\neveryone\nin the world');
    this.set('overlays', [
      { type: 'error', range: new Range(0, 0, 1, 1), text: 'ruh roh' },
      { type: 'info', range: new Range(2, 0, 2, 5), text: 'btw' }
    ]);

    await render(hbs`{{ember-ace lines=3 overlays=this.overlays value=this.value}}`);
    assert.equal(this.component.annotations.length, 2);
    assert.equal(this.component.frontMarkers.length, 2);
    assert.equal(this.component.backMarkers.length, 0);

    assert.equal(this.component.annotations.objectAt(0).type, 'error');
    assert.equal(this.component.annotations.objectAt(0).row, 0);
    assert.equal(this.component.frontMarkers.objectAt(0).type, 'ember-ace-error');
    assert.equal(this.component.frontMarkers.objectAt(0).segmentCount, 2);

    assert.equal(this.component.annotations.objectAt(1).type, 'info');
    assert.equal(this.component.annotations.objectAt(1).row, 2);
    assert.equal(this.component.frontMarkers.objectAt(1).type, 'ember-ace-info');
    assert.equal(this.component.frontMarkers.objectAt(1).segmentCount, 1);
  });

  test('default autocomplete', async function(assert) {
    this.set('value', 'foo\nbar\nf');
    await render(hbs`{{ember-ace lines=3 value=this.value enableDefaultAutocompletion=true}}`);

    const { autocomplete } = this.component;

    this.component.moveCursorTo(2, 1);

    await autocomplete.trigger();
    assert.deepEqual(autocomplete.suggestions.mapBy('caption'), ['oo']);

    await autocomplete.selectFocused();
    assert.equal(this.component.value, 'foo\nbar\nfoo');
  });

  test('basic autocomplete', async function(assert) {
    this.set('suggestCompletions', (editor, session, position, prefix) => {
      return [
        { value: `${prefix}abc`, caption: 'lhs', meta: 'rhs' },
        { value: `${prefix}def`, caption: 'foo', meta: 'bar' },
      ];
    });

    await render(hbs`{{ember-ace lines=3 value='text' suggestCompletions=(action this.suggestCompletions)}}`);
    const { autocomplete } = this.component;

    await autocomplete.trigger();
    assert.deepEqual(autocomplete.suggestions.mapBy('caption'), ['lhs', 'foo']);
    assert.deepEqual(autocomplete.suggestions.mapBy('meta'), ['rhs', 'bar']);
    assert.equal(autocomplete.focusedIndex, 0);
    assert.equal(autocomplete.focusedSuggestion.caption, 'lhs');

    await autocomplete.focusNext();
    assert.equal(autocomplete.focusedIndex, 1);
    assert.equal(autocomplete.focusedSuggestion.caption, 'foo');
    autocomplete.selectFocused();

    assert.equal(this.component.value, 'deftext');
  });

  test('autocomplete with tooltips', async function(assert) {
    assert.expect(0);

    this.set('suggestCompletions', (editor, session, position, prefix) => {
      return [
        { value: `${prefix}abc`, caption: 'lhs', meta: 'rhs', extra: 'key1' },
        { value: `${prefix}def`, caption: 'foo', meta: 'bar', extra: 'key2' },
      ];
    });

    await render(hbs`
      {{#ember-ace lines=3 value='text' suggestCompletions=(action this.suggestCompletions) as |editor|}}
        {{#editor.completion-tooltip as |suggestion|}}
          Payload: {{suggestion.extra}}
        {{/editor.completion-tooltip}}
      {{/ember-ace}}
    `);

    const { autocomplete } = this.component;
    const { tooltip } = autocomplete;

    await autocomplete.trigger();
    await pollCondition('tooltip rendered', () => tooltip.isVisible && tooltip.text === 'Payload: key1');

    await autocomplete.focusNext();
    await pollCondition('tooltip rendered', () => tooltip.isVisible && tooltip.text === 'Payload: key2');
  });

  test('setting a custom mode', async function(assert) {
    const NumberMode = makeMode({
      start: [
        { regex: '[-+]?[0-9]+', token: 'constant.numeric' },
        { defaultToken: 'other' }
      ]
    });

    this.set('mode', new NumberMode());
    this.set('value', 'abc 123\n!@# 456 foo');
    await render(hbs`{{ember-ace mode=this.mode value=this.value}}`);
    assert.deepEqual(this.component.lines.objectAt(0).tokens.mapBy('type'), ['other', 'constant.numeric']);
    assert.deepEqual(this.component.lines.objectAt(1).tokens.mapBy('type'), ['other', 'constant.numeric', 'other']);

    const VariableMode = makeMode({
      start: [
        { regex: '[a-zA-Z]+', token: 'variable' },
        { defaultToken: 'other' }
      ]
    });

    run(() => this.set('mode', new VariableMode()));
    assert.deepEqual(this.component.lines.objectAt(0).tokens.mapBy('type'), ['variable', 'other']);
    assert.deepEqual(this.component.lines.objectAt(1).tokens.mapBy('type'), ['other', 'variable']);
  });

  function makeMode(rules) {
    return class extends TextMode {
      constructor() {
        super();
        this.HighlightRules = class extends TextHighlightRules {
          constructor() {
            super();
            this.$rules = rules;
          }
        }
      }
    }
  }
});
