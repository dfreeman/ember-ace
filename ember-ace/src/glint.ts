import type AceEditor from './components/ace-editor';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AceEditor: typeof AceEditor;
    'ace-editor': typeof AceEditor;
  }
}
