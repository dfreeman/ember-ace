import { type Ace, edit } from 'ace-builds';
import { schedule } from '@ember/runloop';
import Modifier, { ArgsFor } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export interface AceEditorArgs {
  value?: string;
  update?: (newValue: string) => void;
  ready?: (editor: Ace.Editor) => void;
  options?: Partial<Ace.EditorOptions>;
}

export interface AceEditorSignature {
  Element: HTMLPreElement;
  Args: { Named: AceEditorArgs };
}

type ModifierState = {
  editor: Ace.Editor;
  args: AceEditorArgs;
};

export default class AceEditor extends Modifier<AceEditorSignature> {
  private state?: ModifierState;
  private silenceUpdates = false;

  public constructor(owner: unknown, args: ArgsFor<AceEditorSignature>) {
    super(owner, args);
    registerDestructor(this, () => {
      this.state?.editor.destroy();
    });
  }

  public override modify(
    element: HTMLPreElement,
    positional: [],
    newArgs: AceEditorArgs
  ): void {
    if (this.state === undefined) {
      this.instantiateEditor(element, newArgs);
    } else {
      this.updateEditor(this.state.editor, newArgs);
    }
  }

  private instantiateEditor(
    element: HTMLPreElement,
    args: AceEditorArgs
  ): void {
    let editor = edit(element, { value: args.value });

    this.updateEditor(editor, args);
    this.rerender(editor);

    editor.session.on('change', () => {
      if (!this.silenceUpdates) {
        this.state?.args.update?.(editor.getValue());
      }
    });

    args.ready?.(editor);
  }

  private updateEditor(editor: Ace.Editor, args: AceEditorArgs): void {
    let silenced = this.silenceUpdates;
    try {
      this.silenceUpdates = true;

      editor.setOptions(args.options ?? {});

      if (args.value !== undefined && editor.getValue() !== args.value) {
        editor.setValue(args.value, -1);
        this.rerender(editor);
      }
    } finally {
      this.silenceUpdates = silenced;
    }

    this.state = { editor, args };
  }

  private rerender(editor: Ace.Editor): void {
    schedule('afterRender', editor.renderer, editor.renderer.updateFull, true);
  }
}
