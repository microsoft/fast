import { HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element/index.js";
import type { IdleCallbackQueue } from "../utilities/idle-callback-queue.js";

/**
 * Defines the possible loading behaviors a Virtual List Item
 *
 * immediate: Sets loadContent to true on connect.
 *
 * manual: Developer takes ownership of setting loadContent, it will otherwise remain false.
 *
 * idle: The component will load content based on available idle time, this is the default.
 *
 * @public
 */
export type VirtualListItemLoadMode = "immediate" | "manual" | "idle";

/**
 * Used to describe the position of an element within the list
 *
 * @public
 */
export interface SizeMap {
    // start position
    start: number;

    // end position
    end: number;

    // list item size
    size: number;
}

/**
 *  The VirtualListItem class.  Note that all props are set at runtime by the parent list.
 *
 * @public
 */
export class VirtualListItem extends FoundationElement {
    /**
     * Controls how the item loads content
     *
     * @internal
     */
    @observable
    public loadMode: VirtualListItemLoadMode;

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
     *  Custom context provided to the parent virtual list
     *
     * @internal
     */
    @observable
    public listItemContext: object;

    /**
     *  idleCallbackQueue instance
     *
     * @internal
     */
    @observable
    public idleCallbackQueue: IdleCallbackQueue;

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
     *  Flag indicating whether the item should load contents
     *
     * @internal
     */
    @observable
    public loadContent: boolean = false;

    private idleLoadRequested: boolean = false;

    private customView: HTMLView | null = null;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        switch (this.loadMode) {
            case "manual":
                break;

            case "idle":
                this.queueForIdleLoad();
                break;

            default:
                this.loadContent = true;
                break;
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
        if (!this.loadContent && this.idleLoadRequested) {
            this.idleCallbackQueue?.cancelIdleCallback(this);
        }
        this.loadContent = false;
        this.idleLoadRequested = false;
        if (this.customView) {
            this.customView.dispose();
            this.customView = null;
        }
        this.$emit("listitemdisconnected");
    }

    /**
     * Queue up for idle loading
     */
    private queueForIdleLoad(): void {
        if (this.idleLoadRequested || !this.idleCallbackQueue) {
            return;
        }
        this.idleLoadRequested = true;
        this.idleCallbackQueue?.requestIdleCallback(this, () =>
            this.handleIdleCallback()
        );
    }

    /**
     * Handle idle callback
     */
    private handleIdleCallback = (): void => {
        this.loadContent = true;
        this.idleLoadRequested = false;
    };
}
