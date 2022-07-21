# Ember Ace [![Build Status](https://travis-ci.org/dfreeman/ember-ace.svg?branch=master)](https://travis-ci.org/dfreeman/ember-ace)

An Ember component wrapping [Ace editor](https://ace.c9.io).

## Installation

Install this `ember-ace` package and its peer dependency `ace-builds` using your package manager of choice:

```bash
yarn add ember-ace ace-builds
# or
npm install ember-ace ace-builds
# or
pnpm install ember-ace ace-builds
```

## Usage

```hbs
<AceEditor
  @value={{this.code}}
  @update={{this.updateCode}}
  @options={{hash
    minLines=5
    maxLines=20
    theme='ace/theme/chaos'
    mode='ace/mode/css'
  }}
/>
```

### Args

See the application controller in this addon's dummy application for usage examples of several editor options.

- `@value: string`: the string value of the editor
- `@update: (newValue: string) => void`: a callback invoked when the value of the editor changes
- `@options: Partial<Ace.EditorOptions>`: options to be passed to the Ace editor instance
- `@ready: (editor: Ace.Editor) => void`: a callback invoked when the Ace `Editor` is instantiated, for finer-grained control than just setting `@options`

Valid keys to include in `@options` are any member of the [`Ace.EditorOptions` interface](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L205-L223), which also includes [`Ace.EditSessionOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L157-L170), [`Ace.MouseHandlerOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L197-L203) and [`Ace.VirtualRendererOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L172-L195).

### Build Configuration

Build configuration can be specified in an `ace` key in `ember-cli-build.js`:

```js
new EmberApp(defaults, {
  ace: {
    themes: ['ambiance', 'chaos'],
    modes: ['javascript'],
    workers: ['javascript'],
  },
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
