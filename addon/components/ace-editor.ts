import templateOnlyComponent from '@ember/component/template-only';
import { AceEditorArgs } from 'ember-ace/modifiers/-ace-editor';

export interface AceEditorSignature {
  Args: AceEditorArgs;
  Element: HTMLPreElement;
}

export default templateOnlyComponent<AceEditorSignature>();
