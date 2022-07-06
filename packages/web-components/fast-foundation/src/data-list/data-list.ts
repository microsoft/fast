import {
    attr,
    FASTElement,
    nullableNumberConverter,
    observable,
    RepeatBehavior,
    RepeatDirective,
    Updates,
    ViewTemplate,
} from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FASTDataListItem } from "./data-list-item.js";
import type { ItemLoadMode } from "./data-list.options.js";

/**
 *  The DataList class
 *
 * @public
 */
export class FASTDataList extends FASTElement {
    /**
     * Whether or not to recycle the html container used to display items.
     * May help performance but containers may retain artifacts from previous use that
     * developers will need to clear.
     *
     * @public
     */
    @attr({ attribute: "recycle", mode: "boolean" })
    public recycle: boolean = false;

    /**
     *  The array of items to be rendered.
     *
     * @public
     */
    @observable
    public items: object[];
    protected itemsChanged(): void {
        this.renderItems = this.items;
        if (this.$fastController.isConnected) {
            this.initializeRepeatBehavior();
        }
    }

    /**
     * Controls the idle load queue behavior.
     *
     * @public
     * @remarks
     * HTML Attribute: idle-load-mode
     */
    @attr({ attribute: "item-load-mode" })
    public itemLoadMode: ItemLoadMode = "immediate";

    /**
     * The ViewTemplate used in the items repeat loop
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate;
    private itemTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            this.initializeRepeatBehavior();
        }
    }

    /**
     * The ViewTemplate used to render a list item contents
     *
     * @public
     */
    @observable
    public itemContentsTemplate: ViewTemplate;
    private itemContentsTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            this.initializeRepeatBehavior();
        }
    }

    /**
     * Suspends idle loading
     *
     *
     * @public
     */
    @attr({ attribute: "idleLoadingSuspended", mode: "boolean" })
    public idleLoadingSuspended: boolean;
    protected idleLoadingSuspendedChanged(): void {
        if (this.$fastController.isConnected) {
            if (!this.idleLoadingSuspended && this.itemLoadMode === "idle") {
                this.nextCallback();
            }
        }
    }

    /**
     * Defines the idle callback timeout value.
     * Defaults to 1000
     *
     * @public
     * @remarks
     * HTML Attribute: idle-callback-timeout
     */
    @attr({ attribute: "idle-callback-timeout", converter: nullableNumberConverter })
    public idleCallbackTimeout: number = 1000;

    /**
     * Used to pass custom context objects to list items.
     *
     * @public
     */
    @observable
    public listItemContext: object;

    /**
     * the idle callback queue for this list instance.
     * List items can use this instance to coordinate idle loading.
     *
     * @internal
     */
    @observable
    public renderItems: object[] = [];

    // reference to the repeat behavior used to render items
    protected itemsRepeatBehavior: RepeatBehavior | null = null;

    // the placeholder element used by the repeat behavior
    private itemsPlaceholder: Node;

    private idleCallbackInterval: number = 20;
    private callbackQueue: Map<Element, () => void> = new Map<Element, () => void>();
    private currentCallbackId: number | undefined;
    private currentCallbackElement: Element | undefined;
    private currentCallback: (() => void) | undefined;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();

        if (this.itemsPlaceholder === undefined) {
            this.itemsPlaceholder = document.createComment("");
            this.appendChild(this.itemsPlaceholder);
        }

        this.addEventListener("listitemconnected", this.handleListItemConnected);
        this.addEventListener("listitemdisconnected", this.handleListItemDisconnected);

        Updates.enqueue(() => this.initializeRepeatBehavior());
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("listitemconnected", this.handleListItemConnected);
        this.removeEventListener("listitemdisconnected", this.handleListItemDisconnected);
        this.callbackQueue.clear();
        if (this.currentCallbackElement) {
            this.currentCallbackElement;
        }
    }

    /**
     * @internal
     */
    protected handleListItemConnected(e: Event): void {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.requestIdleCallback(
            e.target as FASTDataListItem,
            (e.target as FASTDataListItem).handleIdleCallback
        );
    }

    /**
     * @internal
     */
    protected handleListItemDisconnected(e: Event): void {
        if (e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.cancelIdleCallback(e.target as Element);
    }

    /**
     * initialize repeat behavior for render items
     */
    protected initializeRepeatBehavior(): void {
        if (!this.renderItems || !this.itemTemplate) {
            return;
        }

        if (this.itemsRepeatBehavior) {
            this.clearRepeatBehavior();
        }

        const itemsRepeatDirective = new RepeatDirective(
            x => x.renderItems,
            x => x.itemTemplate,
            { positioning: true, recycle: this.recycle }
        );
        this.itemsRepeatBehavior = itemsRepeatDirective.createBehavior({
            [itemsRepeatDirective.nodeId]: this.itemsPlaceholder,
        });

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }

    protected clearRepeatBehavior(): void {
        if (!this.itemsRepeatBehavior) {
            return;
        }
        this.itemsRepeatBehavior.unbind();
    }

    /**
     * Request an idle callback
     *
     * @internal
     */
    public requestIdleCallback(target: Element, callback: () => void): void {
        if (this.callbackQueue.has(target)) {
            return;
        }
        this.callbackQueue.set(target, callback);
        this.nextCallback();
    }

    /**
     * Cancel an idle callback request
     *
     * @internal
     */
    public cancelIdleCallback(target: Element): void {
        if (this.callbackQueue.has(target)) {
            this.callbackQueue.delete(target);
            return;
        }

        if (this.currentCallbackElement === target && this.currentCallbackId) {
            ((window as unknown) as WindowWithIdleCallback).cancelIdleCallback(
                this.currentCallbackId
            );
            this.currentCallbackId = undefined;
            this.currentCallbackElement = undefined;
            this.currentCallback = undefined;
            this.nextCallback();
        }
    }

    /**
     * Queue up the next item
     */
    private nextCallback = (): void => {
        if (
            this.itemLoadMode !== "idle" ||
            this.idleLoadingSuspended ||
            this.currentCallbackId ||
            this.callbackQueue.size === 0
        ) {
            return;
        }

        const [nextCallbackElement] = this.callbackQueue.keys();
        this.currentCallback = this.callbackQueue.get(nextCallbackElement);
        this.callbackQueue.delete(nextCallbackElement);
        this.currentCallbackElement = nextCallbackElement;

        this.currentCallbackId = ((window as unknown) as WindowWithIdleCallback).requestIdleCallback(
            this.handleIdleCallback,
            { timeout: this.idleCallbackTimeout }
        );
    };

    /**
     *  Handle callback
     */
    private handleIdleCallback = (): void => {
        if (this.currentCallback) {
            this.currentCallback();
        }
        this.currentCallbackId = undefined;
        this.currentCallbackElement = undefined;
        this.currentCallback = undefined;
        window.setTimeout(() => {
            this.nextCallback();
        }, this.idleCallbackInterval);
    };
}
