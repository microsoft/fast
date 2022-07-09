import { FASTElement, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import type { SizeMap } from "./virtual-list.options.js";

/**
 *  The VirtualListItem class.  Note that all props are set at runtime by the parent list.
 *
 * @public
 */
export class FASTVirtualListItem extends FASTElement {
    /**
     * The viewtemplate used to render the item contents
     *
     * @internal
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    /**
     * The list sizemap
     *
     * @internal
     */
    @observable
    public sizeMap: SizeMap[];
    private sizeMapChanged(): void {
        this.itemSizeMap = this.sizeMap[this.itemIndex];
    }

    /**
     * The item sizemap
     *
     * @internal
     */
    @observable
    public itemSizeMap: SizeMap;

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
     * The viewtemplate used to render the item contents
     *
     * @internal
     */
    @observable
    public itemContentsTemplate: ViewTemplate;
    private itemContentsTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.customView) {
                this.customView.dispose();
            }
            this.customView = this.itemContentsTemplate.render(this, this);
        }
    }

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

        if (this.itemContentsTemplate) {
            this.customView = this.itemContentsTemplate.render(this, this);
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
