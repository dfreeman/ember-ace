# Ember Ace [![Build Status](https://travis-ci.org/dfreeman/ember-ace.svg?branch=master)](https://travis-ci.org/dfreeman/ember-ace)

An Ember component wrapping [Ace editor](https://ace.c9.io).

## Installation

```bash
ember install ember-ace
```

## Usage

```hbs
{{ember-ace lines=10 value=value update=(action 'valueUpdated')}}
```

### Options

See the application controller in this addon's dummy application for usage examples of many of these options.

#### Core
 - `value`: the string value of the editor
 - `update(newValue)`: an action triggered when the value of the editor changes
 - `ready(editor)`: an action triggered when the Ace `Editor` is instantiated

#### Configuration
 - `mode`: the mode for the editor to operate in, either a string (e.g. `"ace/mode/javascript"`) or a `Mode` instance
 - `theme`: the color scheme to be used (e.g. `"ace/theme/chaos"`);
 - `useSoftTabs`: a boolean indicating whether to use spaces for indentation
 - `tabSize`: the number of spaces a tab represents
 - `useWrapMode`: a boolean indicating whether to wrap long lines
 - `highlightActiveLine`: a boolean indicating whether the active line should be highlighted
 - `showPrintMargin`: a boolean indicating whether a line indicating the print margin should be shown
 - `printMarginColumn`: a boolean indicating what column the print margin (if enabled) should appear at
 - `showInvisibles`: a boolean indicating whether to show invisible characters
 - `readOnly`: a boolean indicating whether the editor is locked to the user
 - `showLineNumbers`: a boolean indicating if line numbers are shown in the left gutter. Default to true.

#### Sizing
 - `editorClass`: a CSS class name that will be applied to the element that Ace is instantiated on (note that setting `class` will apply to the ember-ace wrapper)
 - `lines`: the number of lines the editor should show (shorthand for setting both `minLines` and `maxLines`)
 - `minLines`: the minimum number of lines the editor should contain
 - `maxLines`: the maximum number of lines the editor should expand to

#### Completion
 - `enableDefaultAutocompletion`: a boolean indicating whether to enable Ace's default completions (which basically just look for similar words within the existing document)
 - `enableLiveAutocompletion`: whether to automatically trigger completion, or require the user to make an explicit gesture (typically `Ctrl + Space`)
 - `suggestCompletions`: an action to supply your own completion suggestions (see below for details)

#### Overlays
 - `overlays`: an array of objects describing notices that should be overlaid on the editor, each containing the following keys:
   - `type`: one of `error`, `warning` or `info`, which will impact the icon that appears on the overlaid row
   - `text`: text for a tooltip that will appear when the user hovers the overlay icon
   - `range`: an `Ace.Range` instance denoting the section of text to be marked
   - `class`: a string containing any classes that should be added to the element(s) overlaying the marked text (an `ember-ace-${type}` class will automatically be applied)

Note that `overlays` is actually shorthand for configuring the following two options individually:
 - `markers`: an array of text marker objects, each containing the following keys:
   - `class`: the class name that should be applied to the element(s) overlaying the marked text
   - `range`: an `Ace.Range` instance denoting the section of text to be marked
   - `inFront`: a boolean (default `true`) indicating whether the marker should be in front of or behind the text layer
 - `annotations`: an array of line annotation objects, each of which contains the following keys:
   - `type`: one of `error`, `warning` or `info`
   - `row`: the zero-based index of the row the annotation should appear on
   - `text`: the text to appear when the annotation is hovered

### Build Configuration

Build configuration can be specified in an `ace` key in `ember-cli-build.js`:

```js
new EmberApp(defaults, {
  ace: {
    themes: ['ambiance', 'chaos'],
    modes: ['javascript'],
    workers: ['javascript']
  }
});
```

For each of the following types, you may specify an array of names to be included in your Ace build (as above).

 - `modes`: syntax highlighting and editor behaviors for different languages ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/mode))
 - `workers`: background workers to perform more expensive processing available for some modes ([see all, intermingled with modes](https://github.com/ajaxorg/ace/tree/master/lib/ace/mode))
 - `themes`: color schemes for the editor ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/theme))
 - `exts`: editor extensions, like spellcheck and Emmet abbreviations ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/ext))
 - `keybindings`: common keybindings from editors like Emacs and Vim ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/keyboard))

If you need to customize the worker path you can specify `workerPath` in the build configuration.

```js
new EmberApp(defaults, {
  ace: {
    ...
    workerPath: '/my/custom/worker-path'
  }
});
```

### Autocompletion
**Note**: completion requires the language tools extension to be included. You'll need to set `exts: ['language_tools']` in your configuration in order for autocomplete to work.

#### Custom Completion
To enable custom autocomplete suggestions in your editor, you can implement the `suggestCompletions` action. The action will receive four arguments:
  - `editor`: an Ace [Editor](https://ace.c9.io/#nav=api&api=editor) instance
  - `session`: an Ace [EditSession](https://ace.c9.io/#nav=api&api=edit_session) instance
  - `position`: a hash with `row` and `column` indicating where the cursor is in the document
  - `prefix`: the leading characters the user entered before triggering completion

The action is expected to return an array (or a promise for one) containing objects with the following keys:
  - `value`: the core 'value' this suggestion is considered to hold (note that any suggestions whose value doesn't include the given prefix are filtered out by Ace)
  - `score`: a numeric value indicating how good a match this suggestion is (optional; higher is better)
  - `caption`: the text that will appear in the dropdown representing this suggestion (defaults to `value`)
  - `meta`: supplemental information that will appear on the righthand side in the dropdown for this suggestion (optional)
  - `snippet`: a string representing what will actually appear in the editor if this suggestion is selected (defaults to `value`)

#### Completion Tooltips
Each suggestion may also have a rendered tooltip providing arbitrary additional information about that suggestion (e.g. function documentation). To do so, you can use the `completion-tooltip` contextual component:

```hbs
{{#ember-ace ... as |editor|}}
  {{#editor.completion-tooltip as |suggestion|}}
    {{!
      Here, `suggestion` is an object from the array returned by `suggestCompletions`.
      You can include any additional information you want there to facilitate rendering here.
    }}
  {{/editor.completion-tooltip}}
{{/ember-ace}}
```
