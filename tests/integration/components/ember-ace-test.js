import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import { TextMode, TextHighlightRules, Range } from 'ember-ace';
import PageObject from 'ember-cli-page-object';
import aceComponent from 'dummy/tests/components/ember-ace';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('ember-ace', 'Integration | Component | ember ace', {
  integration: true,

  beforeEach() {
    this.component = PageObject.create(aceComponent);
    this.component.setContext(this);
  },

  afterEach() {
    this.component.removeContext();
  }
});

test('rendering a given value', function(assert) {
  this.set('value', 'function() {\n  console.log("hi");\n}');
  this.render(hbs`{{ember-ace lines=3 value=value}}`);

  assert.equal(this.component.lines().count, 3);
  assert.equal(this.component.value, this.get('value'));

  Ember.run(() => this.set('value', '// nevermind'));
  assert.equal(this.component.lines().count, 1);
  assert.equal(this.component.value, this.get('value'));
});

test('leading, trailing and internal whitespace', function(assert) {
  this.set('value', '\n\na\n  \nb\n\n');
  this.render(hbs`{{ember-ace lines=10 value=value}}`);

  assert.equal(this.component.lines().count, 7);
  assert.equal(this.component.value, this.get('value').trim());
});

test('internal value updates', function(assert) {
  this.set('change', sinon.spy());
  this.render(hbs`{{ember-ace lines=1 update=(action change)}}`);

  this.component.setValue('hello');
  assert.ok(this.get('change').calledWith('hello'));
  assert.equal(this.get('change.callCount'), 1);
  assert.equal(this.component.value, 'hello');
});

test('external value updates', function(assert) {
  this.set('value', 'one');
  this.set('change', sinon.spy());
  this.render(hbs`{{ember-ace lines=1 value=value update=(action change)}}`);

  Ember.run(() => this.set('value', 'two'));
  assert.equal(this.get('change.callCount'), 0);
  assert.equal(this.component.value, 'two');
});

test('setting a theme', function(assert) {
  this.set('theme', 'ace/theme/ambiance');
  this.render(hbs`{{ember-ace theme=theme}}`);
  assert.ok(this.$('.ace_editor').is('.ace-ambiance'));

  Ember.run(() => this.set('theme', 'ace/theme/chaos'));
  assert.ok(this.$('.ace_editor').is('.ace-chaos'));
});

test('annotating lines', function(assert) {
  this.set('annotations', [{ type: 'warning', row: 1 }]);
  this.set('value', 'hello\nworld');
  this.render(hbs`{{ember-ace lines=3 annotations=annotations value=value}}`);
  assert.equal(this.component.annotations().count, 1);
  assert.equal(this.component.annotations(0).type, 'warning');
  assert.equal(this.component.annotations(0).row, 1);

  Ember.run(() => this.set('annotations', [{ type: 'error', row: 0 }]));
  assert.equal(this.component.annotations().count, 1);
  assert.equal(this.component.annotations(0).type, 'error');
  assert.equal(this.component.annotations(0).row, 0);

  Ember.run(() => this.set('annotations', []));
  assert.equal(this.component.annotations().count, 0);
});

test('front range markers', function(assert) {
  this.set('value', 'hello\neveryone\nin the world');
  this.set('markers', [
    { class: 'foo', range: new Range(0, 0, 1, 1) },
    { class: 'bar', range: new Range(2, 0, 2, 5) }
  ]);
  this.render(hbs`{{ember-ace lines=3 markers=markers value=value}}`);
  assert.equal(this.component.backMarkers().count, 0);
  assert.equal(this.component.frontMarkers().count, 2);
  assert.equal(this.component.frontMarkers(0).type, 'foo');
  assert.equal(this.component.frontMarkers(0).segmentCount, 2);
  assert.equal(this.component.frontMarkers(1).type, 'bar');
  assert.equal(this.component.frontMarkers(1).segmentCount, 1);

  Ember.run(() => this.set('markers', [{ class: 'baz', range: new Range(1, 0, 1, 1) }]));
  assert.equal(this.component.frontMarkers().count, 1);
  assert.equal(this.component.frontMarkers(0).type, 'baz');
  assert.equal(this.component.frontMarkers(0).segmentCount, 1);

  Ember.run(() => this.set('markers', []));
  assert.equal(this.component.frontMarkers().count, 0);
});

test('back range markers', function(assert) {
  this.set('value', 'hello\neveryone\nin the world');
  this.set('markers', [
    { class: 'foo', range: new Range(0, 0, 1, 1), inFront: false },
    { class: 'bar', range: new Range(2, 0, 2, 5), inFront: false }
  ]);
  this.render(hbs`{{ember-ace lines=3 markers=markers value=value}}`);
  assert.equal(this.component.frontMarkers().count, 0);
  assert.equal(this.component.backMarkers().count, 2);
  assert.equal(this.component.backMarkers(0).type, 'foo');
  assert.equal(this.component.backMarkers(0).segmentCount, 2);
  assert.equal(this.component.backMarkers(1).type, 'bar');
  assert.equal(this.component.backMarkers(1).segmentCount, 1);

  Ember.run(() => this.set('markers', [{ class: 'baz', range: new Range(1, 0, 1, 1), inFront: false }]));
  assert.equal(this.component.backMarkers().count, 1);
  assert.equal(this.component.backMarkers(0).type, 'baz');
  assert.equal(this.component.backMarkers(0).segmentCount, 1);

  Ember.run(() => this.set('markers', []));
  assert.equal(this.component.backMarkers().count, 0);
});

test('setting a custom mode', function(assert) {
  const NumberMode = makeMode({
    start: [
      { regex: '[-+]?[0-9]+', token: 'constant.numeric' },
      { defaultToken: 'other' }
    ]
  });

  this.set('mode', new NumberMode());
  this.set('value', 'abc 123\n!@# 456 foo');
  this.render(hbs`{{ember-ace mode=mode value=value}}`);
  assert.deepEqual(this.component.lines(0).tokens().mapBy('type'), ['other', 'constant.numeric']);
  assert.deepEqual(this.component.lines(1).tokens().mapBy('type'), ['other', 'constant.numeric', 'other']);

  const VariableMode = makeMode({
    start: [
      { regex: '[a-zA-Z]+', token: 'variable' },
      { defaultToken: 'other' }
    ]
  });

  Ember.run(() => this.set('mode', new VariableMode()));
  assert.deepEqual(this.component.lines(0).tokens().mapBy('type'), ['variable', 'other']);
  assert.deepEqual(this.component.lines(1).tokens().mapBy('type'), ['other', 'variable']);
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
