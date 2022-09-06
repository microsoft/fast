import {
    attr,
    bind,
    DOM,
    FASTElement,
    nullableNumberConverter,
    Observable,
    observable,
    RepeatBehavior,
    RepeatDirective,
    Splice,
    ViewTemplate,
} from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { IdleCallbackQueue } from "../utilities/idle-callback-queue.js";
import type { ListIdleLoadMode, ListItemLoadMode } from "./base-list.options.js";

/**
 *  The BaseList class
 *
 * @public
 */
export class FASTBaseList extends FASTElement {
    /**
     * Whether the list is oriented vertically or horizontally.
     * Default is vertical.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr({ attribute: "orientation" })
    public orientation: Orientation = Orientation.vertical;

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
     * Controls the idle load queue behavior.
     *
     * @public
     * @remarks
     * HTML Attribute: idle-load-mode
     */
    @attr({ attribute: "idle-load-mode" })
    public idleLoadMode: ListIdleLoadMode = "auto";
    private idleLoadModeChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.idleLoadMode === "suspended") {
                this.idleCallbackQueue.suspend();
            } else {
                this.idleCallbackQueue.resume();
            }
        }
    }

    /**
     *  The array of items to be displayed.
     *
     * @public
     */
    @observable
    public items: object[] = [];

    /**
     * The ViewTemplate used in the items repeat loop
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate;

    /**
     * The ViewTemplate used to render a list item contents
     *
     * @public
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    /**
     * Determines when child virtual list items load content,
     * or more specifically when the item's "loadContent" observable prop
     * becomes 'true'.
     *
     * "immediate": When the component connects.
     * "manual": When set manually by some external code (ie. 'myListItem.laodContent = true')
     * "idle": Items are loaded based on available idle cycles.
     *
     *
     * @public
     */
    @attr({ attribute: "list-item-load-mode" })
    public listItemLoadMode: ListItemLoadMode;

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
    private idleCallbackTimeoutChanged(): void {
        if (this.$fastController.isConnected) {
            this.idleCallbackQueue.idleCallbackTimeout = this.idleCallbackTimeout;
        }
    }

    /**
     * Used to pass custom context objects to list items.
     *
     * @public
     */
    @observable
    public listItemContext: object;

    /**
     * The default ViewTemplate used to render items vertically.
     *
     * @internal
     */
    @observable
    public defaultVerticalItemTemplate: ViewTemplate;

    /**
     * The default ViewTemplate used to render items horizontally.
     *
     * @internal
     */
    @observable
    public defaultHorizontalItemTemplate: ViewTemplate;

    /**
     * the idle callback queue for this list instance.
     * List items can use this instance to coordinate idle loading.
     *
     * @internal
     */
    @observable
    public idleCallbackQueue: IdleCallbackQueue = new IdleCallbackQueue();

    /**
     * reference to the container element
     *
     * @internal
     */
    public containerElement: HTMLDivElement;

    // reference to the repeat behavior used to render items
    private itemsRepeatBehavior: RepeatBehavior | null = null;

    // the placeholder element used by the repeat behavior
    private itemsPlaceholder: Node;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();

        this.idleCallbackQueue.idleCallbackTimeout = this.idleCallbackTimeout;
        if (this.idleLoadMode === "suspended") {
            this.idleCallbackQueue.suspend();
        }

        if (this.itemsPlaceholder === undefined) {
            this.itemsPlaceholder = document.createComment("");
            this.appendChild(this.itemsPlaceholder);
        }

        if (!this.itemTemplate) {
            this.itemTemplate =
                this.orientation === Orientation.vertical
                    ? this.defaultVerticalItemTemplate
                    : this.defaultHorizontalItemTemplate;
        }

        this.initializeRepeatBehavior();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.removeBehaviors([this.itemsRepeatBehavior!]);
    }

    /**
     * initialize repeat behavior
     */
    private initializeRepeatBehavior(): void {
        if (this.itemsRepeatBehavior !== null) {
            return;
        }

        const itemsRepeatDirective = new RepeatDirective<FASTBaseList>(
            bind(x => x.items, false),
            bind(x => x.itemTemplate, false),
            { positioning: true, recycle: this.recycle }
        );
        this.itemsRepeatBehavior = itemsRepeatDirective.createBehavior({
            [itemsRepeatDirective.nodeId]: this.itemsPlaceholder,
        });

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }
}
