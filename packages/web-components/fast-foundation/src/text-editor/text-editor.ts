import { attr, DOM, Notifier, Observable } from "@microsoft/fast-element";
import { createEditor, IEditor, toggleBold } from "roosterjs";
import { FoundationElement } from "../foundation-element";

/**
 * A text editor Custom HTML Element.
 *
 * @public
 */
export class TextEditor extends FoundationElement {
    private editorHost: HTMLDivElement;
    private editor: IEditor;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.editorHost = document.createElement("div");
        this.appendChild(this.editorHost);
        this.editor = createEditor(this.editorHost);
    }

    /**
     * @internal
     */
    public disconnectedCallback() {
        super.disconnectedCallback();
    }
}
