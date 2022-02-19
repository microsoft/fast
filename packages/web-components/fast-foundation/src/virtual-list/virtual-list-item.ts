import { observable, ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import { IdleCallbackQueue } from "../utilities/idle-callback-queue";

/**
 * List item context interface
 *
 * @public
 */
export interface VirtualListItemContext {
    listItemContentsTemplate: ViewTemplate;
}

/**
 * Defines the possible loading behaviors a Virtual List Item
 *
 * immediate: Sets loadContent to true on connect, this is the default.
 *
 * manual: Developer takes ownership of setting loadContent, it will otherwise remain false.
 *
 * idle: The component will load content based on available idle time.
 *
 * @public
 */
export type VirtualListItemLoadMode = "immediate" | "manual" | "idle";

/**
 *  The VirtualListItem class
 *
 * @public
 */
export class VirtualListItem extends FoundationElement {
    private static idleCallbackQueue: IdleCallbackQueue = new IdleCallbackQueue();

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
     *  Sets the behavior for how the component updates the loadContent prop
     *
     * @public
     */
    @observable
    public loadMode: VirtualListItemLoadMode;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        switch (this.loadMode) {
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
        if (!this.loadContent && this.loadMode === "idle") {
            VirtualListItem.idleCallbackQueue.cancelIdleCallback(this);
        }
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
        VirtualListItem.idleCallbackQueue.requestIdleCallback(
            this,
            this.handleIdleCallback
        );
    }

    /**
     * Handle idle callback
     */
    private handleIdleCallback = (): void => {
        this.loadContent = true;
    };
}
