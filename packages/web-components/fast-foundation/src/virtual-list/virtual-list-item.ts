import { observable, ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import type { IdleCallbackQueue } from "../utilities/idle-callback-queue";

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
    readonly start: number;

    // end position
    readonly end: number;

    // list item size
    readonly size: number;
}

/**
 * List item context interface
 *
 * @public
 */
export interface VirtualListItemContext {
    // the template to use to render the list item
    listItemContentsTemplate: ViewTemplate;
}

/**
 *  The VirtualListItem class
 *
 * @public
 */
export class VirtualListItem extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @observable
    public loadMode: VirtualListItemLoadMode;

    /**
     * The ViewTemplate used to render contents.
     *
     * @public
     */
    @observable
    public itemData: object;

    /**
     * The index of the item in the items array.
     *
     * @public
     */
    @observable
    public itemIndex: number;

    /**
     *  Custom context provided to the parent virtual list
     *
     * @public
     */
    @observable
    public listItemContext: VirtualListItemContext;

    /**
     *  Flag indicating whether the item should load contents
     *
     * @public
     */
    @observable
    public loadContent: boolean = false;

    /**
     *  idleCallbackQueue instance
     *
     * @public
     */
    @observable
    public idleCallbackQueue: IdleCallbackQueue;

    private idleLoadRequested: boolean = false;

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
    }

    /**
     * @internal
     */
    disconnectedCallback(): void {
        if (!this.loadContent && this.idleLoadRequested) {
            this.idleCallbackQueue?.cancelIdleCallback(this);
        }
        this.loadContent = false;
        this.idleLoadRequested = false;
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    resolveTemplate(): ViewTemplate {
        return this.listItemContext.listItemContentsTemplate;
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
