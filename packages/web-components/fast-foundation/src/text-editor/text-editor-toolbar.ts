import { HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import type { IEditor } from "roosterjs";
import { Toolbar } from "../toolbar";

/**
 * A text editor toolbar custom element
 *
 * @alpha
 */
export class TextEditorToolbar extends Toolbar {
    /**
     * Sets the template to use to generate the toolbar.
     * Set the the text editor.
     *
     * @internal
     */
    @observable
    public toolbarTemplate: ViewTemplate<TextEditorToolbar>;

    /**
     * Sets the template to use to generate the toolbar.
     * Set the the text editor.
     *
     * @internal
     */
    @observable
    public resources: object = {};

    /**
     *
     *
     * @internal
     */
    @observable
    public editor: IEditor;

    /**
     * The default toolbar template.  Set by the component template.
     *
     * @internal
     */
    @observable
    public defaultToolbarTemplate: ViewTemplate<TextEditorToolbar>;

    private toolbarView: HTMLView | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    private updateView(): void {
        this.disconnectView();

        if (this.toolbarTemplate !== undefined) {
            this.toolbarView = this.toolbarTemplate.render(this, this);
        } else {
            this.toolbarView = this.defaultToolbarTemplate.render(this, this);
        }
    }

    private disconnectView(): void {
        if (this.toolbarView !== null) {
            this.toolbarView.dispose();
            this.toolbarView = null;
        }
    }
}
