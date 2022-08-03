import templateOnlyComponent from '@ember/component/template-only';
import { type AceEditorArgs } from '../modifiers/-ace-editor';

export interface AceEditorSignature {
  Args: AceEditorArgs;
  Element: HTMLPreElement;
}

export default templateOnlyComponent<AceEditorSignature>();
