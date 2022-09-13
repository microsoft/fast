import { FASTElement, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";

/**
 *  The DataListItem class.  Note that all props are set at runtime by the parent list.
 *
 * @public
 */
export class FASTDataListItem extends FASTElement {
    /**
     * The data associated with this item
     *
     * @internal
     */
    @observable
    public itemData: object;

    /**
     * The index of the item in the items array.
     *
     * @internal
     */
    @observable
    public itemIndex: number;

    /**
     * The viewtemplate used to render the item contents
     *
     * @internal
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    private customView: HTMLView | null = null;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.listItemContentsTemplate) {
            this.customView = this.listItemContentsTemplate.render(this, this);
        }

        this.$emit("listitemconnected");
    }

    /**
     * @internal
     */
    disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.customView) {
            this.customView.dispose();
            this.customView = null;
        }
        this.$emit("listitemdisconnected");
    }
}
