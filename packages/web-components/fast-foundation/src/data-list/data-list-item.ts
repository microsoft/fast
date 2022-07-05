import { FASTElement, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";

/**
 *  The DataListItem class.  Note that all props are set at runtime by the parent list.
 *
 * @public
 */
export class FASTDataListItem extends FASTElement {
    /**
     * Whether idle loading is enabled
     *
     * @internal
     */
    @observable
    public idleLoad: boolean;

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
     *  Custom context provided to the parent data list
     *
     * @internal
     */
    @observable
    public listItemContext: object;

    /**
     * The viewtemplate used to render the item contents
     *
     * @internal
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    /**
     *  Flag indicating whether the item should load contents
     *
     * @internal
     */
    @observable
    public loadContent: boolean = false;

    private customView: HTMLView | null = null;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.idleLoad) {
            this.loadContent = true;
        }

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
        this.loadContent = false;
        if (this.customView) {
            this.customView.dispose();
            this.customView = null;
        }
        this.$emit("listitemdisconnected");
    }

    /**
     * Handle idle callback
     */
    public handleIdleCallback = (): void => {
        this.loadContent = true;
    };
}
