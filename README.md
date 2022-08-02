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

### Component Args

See the application controller in this addon's dummy application for usage examples of several editor options.

- `@value: string`: the string value of the editor
- `@update: (newValue: string) => void`: a callback invoked when the value of the editor changes
- `@options: Partial<Ace.EditorOptions>`: options to be passed to the Ace editor instance
- `@ready: (editor: Ace.Editor) => void`: a callback invoked when the Ace `Editor` is instantiated, for finer-grained control than just setting `@options`

Valid keys to include in `@options` are any member of the [`Ace.EditorOptions` interface](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L205-L223), which also includes [`Ace.EditSessionOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L157-L170), [`Ace.MouseHandlerOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L197-L203) and [`Ace.VirtualRendererOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L172-L195).

### Configuring Ace

Ace distributes individual themes, editor modes, and so on in individual modules in order to allow you to opt in to having them individually included in your build rather than paying the cost in bundle size of including every single one. You can import these modules to make them available when configuring your editor.

For example, by adding the following somewhere in your project:

```ts
import 'ace-builds/src-noconflict/theme-ambiance';
```

You can then use the `ambiance` theme for your editor:

```hbs
<AceEditor @options={{hash theme='ace/theme/ambiance'}} />
```

While the paths aren't identical, generally you can map from the on-disk path `ace-builds/src-noconflict/{type}-{name}` to a config value `ace/{type}/{name}`, where `type` is one of:

- `theme`: color schemes for the editor ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/theme))
- `mode`: syntax highlighting and editor behaviors for different languages ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/mode))
- `ext`: editor extensions, like spellcheck and Emmet abbreviations ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/ext))
- `keybinding`: common keybindings from editors like Emacs and Vim ([see all](https://github.com/ajaxorg/ace/tree/master/lib/ace/keyboard)

### Background Workers

Some editor modes include background workers that can perform more expensive processing to provide a richer editing experience. Since these modules are always loaded in a background worker, you can't include them directly in your build. Instead, you need to make them available to load at runtime and tell Ace where to find them.

The easiest way to do this is by asking Webpack to treat those modules as external resources, meaning the bundler will include them as standalone files in your build output and provide you with a URL for those those files when you attempt to import them.

```js
// ember-cli-build.js
let app = new EmberApp(defaults, {
  autoImport: {
    webpack: {
      module: {
        rules: [
          // Treat imports with `?resource` as external resources
          {
            resourceQuery: /resource/,
            type: 'asset/resource',
          },
        ],
      },
    },
  },
});
```

```ts
import { config } from 'ace-builds';
import * as jsWorkerUrl from 'ace-builds/src-noconflict/worker-javascript?resource';

config.setModuleUrl('ace/mode/javascript_worker', jsWorkerUrl);
```

For TypeScript use, you can put the following in a `.d.ts` file in your project to ensure the worker URL imports are treated correctly:

```ts
declare module '*?resource' {
  const url: string;
  export = url;
}
```

See the Webpack documentation on [asset modules](https://webpack.js.org/guides/asset-modules/) for more details and configuration options.
