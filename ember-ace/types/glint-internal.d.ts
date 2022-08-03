import '@glint/environment-ember-loose';

import type AceEditorModifier from 'ember-ace/modifiers/-ace-editor';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    '-ace-editor': typeof AceEditorModifier;
  }
}
