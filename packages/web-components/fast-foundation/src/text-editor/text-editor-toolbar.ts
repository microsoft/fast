import { HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { uniqueId } from "@microsoft/fast-web-utilities";
import type { FormatState, IEditor } from "roosterjs";
import { getFormatState } from "roosterjs-editor-api";
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
    private toolbarTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

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
     *
     *
     * @internal
     */
    @observable
    public formatState: FormatState;

    /**
     * The default toolbar template.  Set by the component template.
     *
     * @internal
     */
    @observable
    public defaultToolbarTemplate: ViewTemplate<TextEditorToolbar>;

    /**
     * Unique id of this toolbar
     *
     * @internal
     */
    public instanceId: string = uniqueId("toolbar-id-");

    private toolbarView: HTMLView | null = null;

    /**
     * The timer that tracks format state updates
     */
    private formatStateUpdateTimer: number | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.updateFormatState();
        this.updateView();
        this.startFormatStateUpdateTimer();
    }

    private updateFormatState(): void {
        if (!this.editor) {
            return;
        }
        this.formatState = getFormatState(this.editor);
        this.startFormatStateUpdateTimer();
    }

    /**
     * starts the update timer
     */
    private startFormatStateUpdateTimer(): void {
        this.clearFormatStateUpdateTimer();

        this.formatStateUpdateTimer = window.setTimeout((): void => {
            this.handleFormatStateUpdateTimerTick();
        }, 200);
    }

    /**
     * clears the update timer
     */
    private clearFormatStateUpdateTimer(): void {
        if (this.formatStateUpdateTimer !== null) {
            clearTimeout(this.formatStateUpdateTimer);
            this.formatStateUpdateTimer = null;
        }
    }

    private handleFormatStateUpdateTimerTick(): void {
        this.updateFormatState();
        this.startFormatStateUpdateTimer();
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
