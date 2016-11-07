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

#### Sizing
 - `lines`: the number of lines the editor should show (shorthand for setting both `minLines` and `maxLines`)
 - `minLines`: the minimum number of lines the editor should contain
 - `maxLines`: the maximum number of lines the editor should expand to

#### Overlays
 - `markers`: an array of marker objects, each containing the following keys:
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

For each of the following types, you may specify an array of names to be included in your Ace build (as above). To see the full list of available entities, check the `src-noconflict` directory of the `ace-builds` npm package that this addon depends on.

 - `modes`: syntax highlighting and editor behaviors for different languages
 - `workers`: background workers to provide things like linting and semantic checks for certain languages
 - `themes`: color schemes for the editor
 - `exts`: editor extensions, like spellcheck and Emmet abbreviations
 - `keybindings`: common keybindings from editors like Emacs and Vim
