import { html, observable, ViewTemplate } from "@microsoft/fast-element";
import { toggleBold, toggleItalic } from "roosterjs-editor-api";
import type { IEditor } from "roosterjs";
import type { ElementDefinitionContext } from "..";
import { Toolbar } from "../toolbar";

/**
 * A text editor toolbar custom element
 *
 * @alpha
 */
export class TextEditorToolbar extends Toolbar {
    /**
     *
     *
     * @internal
     */
    @observable
    public editor: IEditor;
}
