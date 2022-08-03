## 3.0.0 (August 3, 2022)

This release is a fairly significant overhaul of the package, simplifying the Ember-specific bits and more directly exposing Ace itself.

### Breaking Changes
- The minimum supported Ember version is 3.24
- This package is now a v2 addon, and consumers must be using Embroider or `ember-auto-import@2`.
- The `ace-builds` package is now a `peerDependency` that should be provided by the host.
- Ace itself is no longer re-exported by `ember-ace`; any of its exports you were using should now be imported directly from `ace-builds`.
- The `{{ember-ace}}` component is now `<AceEditor />`.
- Rendering completion tooltips in-template is no longer supported (this never fully worked previously).
- Most args to the editor component have been dropped in favor of an `@options` object that will be passed directly through to Ace (see detailed migration guide below).
- All previous build-time configuration is now managed via bundler imports (see detailed migration guide below).

### Migrating Component Usage

Update any usage of `{{ember-ace}}` or `<EmberAce />` to `<AceEditor />`.

The `@value`, `@update` and `@ready` args continue to function as before. A new `@options` argument has been added that is passed through directly to the editor, encompassing many args the component previously accepted.

Valid keys to include in `@options` are any member of the [`Ace.EditorOptions` interface](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L205-L223), which also includes [`Ace.EditSessionOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L157-L170), [`Ace.MouseHandlerOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L197-L203) and [`Ace.VirtualRendererOptions`](https://github.com/ajaxorg/ace/blob/f7432f5264102b40e48dab1e948f47e195fc1459/ace.d.ts#L172-L195).

The following keys will continue to function as before, but should be passed as part of `@options` rather than as top-level args:
 - `mode`
 - `theme`
 - `useSoftTabs`
 - `tabSize`
 - `useWrapMode` (or just `wrap`)
 - `highlightActiveLine`
 - `showPrintMargin`
 - `showInvisibles`
 - `readOnly`
 - `showLineNumbers`
 - `minLines`
 - `maxLines`
 - `enableLiveAutocompletion`

The following keys are now defunct:
 - `lines`: pass `minLines` and `maxLines` in `@options` instead
 - `editorClass`: set a regular `class` attribute directly on the `<AceEditor />` component instead
 - `enableDefaultAutocompletion`: pass `enableBasicAutocompletion` in `@options` instead
 - `suggestCompletions`: [register a custom completer](https://jsitor.com/tdQTZKMlU) manually
 - `overlays`: manually register `markers` and `annotations` using the `Ace.Editor` instance provided to the `@ready` action
 - `markers`: use `@ready` and `editor.session.{addMarker,removeMarker}` to manage markers on the editor
 - `annotations`: use `@ready` and `editor.session.setAnnotations` to manage annotations on the editor

### Migrating Build Configuration

Prior to version 3, including custom modes, themes, etc for your editor was managed via build-time config in your `ember-cli-build.js` file.

Now, that process is handled by your bundler (typically Webpack, via `ember-auto-import` or Embroider). For example, by adding the following somewhere in your project:

```ts
import 'ace-builds/src-noconflict/theme-ambiance';
```

You can then use the `ambiance` theme for your editor:

```hbs
<AceEditor @options={{hash theme='ace/theme/ambiance'}} />
```

See [Configuring Ace](README.md#configuring-ace) in the README for further details and guidance for including background workers for some editor modes.

## 2.0.1 (September 10, 2018)
### Fixed
The `enableDefaultAutocompletion` option now actually, well, works. See [#29](https://github.com/dfreeman/ember-ace/issues/29).

## 2.0.0 (August 14, 2018)
### Changed
- Updated to the latest `ace-builds` release
- Updated the page object in `addon-test-support` to use the new `collection` API (available in 1.14 and higher)

### Upgrade Notes
The main notable change with the newer Ace version is that autocomplete items returned from the `suggestCompletions` action are subject to [different sorting rules than in previous versions](https://github.com/ajaxorg/ace/blob/b7554f698fbae97ab410ae97a7b986d40cbd36fb/lib/ace/autocomplete.js#L462-L465).

See the Ember CLI Page Object documentation for details on the changes to the `collection` API, comparing [the old API](http://ember-cli-page-object.js.org/docs/v1.13.x/api/collection) to [the new one](http://ember-cli-page-object.js.org/docs/v1.14.x/api/collection).
