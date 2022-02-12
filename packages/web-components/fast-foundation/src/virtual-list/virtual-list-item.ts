import { HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";

/**
 *  The VirtualListItem class
 *
 * @public
 */
export class VirtualListItem extends FoundationElement {
    /**
     * The ViewTemplate used to render contents.
     *
     * @public
     */
    @observable
    public contentTemplate: ViewTemplate;

    /**
     * The ViewTemplate used to render contents.
     *
     * @public
     */
    @observable
    public itemData: object;

    /**
     * The default ViewTemplate used to render contents.
     *
     * @internal
     */
    @observable
    public defaultContentsTemplate: ViewTemplate;

    private contentsView: HTMLView | null = null;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.updateContentsView();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.disconnectContentsView();
    }

    private updateContentsView(): void {
        this.disconnectContentsView();
        const templateToRender: ViewTemplate =
            this.contentTemplate ?? this.defaultContentsTemplate;
        this.contentsView = templateToRender.render(this, this);
    }

    private disconnectContentsView(): void {
        if (this.contentsView !== null) {
            this.contentsView.dispose();
            this.contentsView = null;
        }
    }
}
