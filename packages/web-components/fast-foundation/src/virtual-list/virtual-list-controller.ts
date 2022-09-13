import {
    bind,
    observable,
    RepeatBehavior,
    RepeatDirective,
} from "@microsoft/fast-element";
import type { DataList, DataListController } from "../data-list/data-list.options.js";
import type { SizeMap } from "./virtual-list.options.js";

export class VirtualListController implements DataListController {
    /**
     * Item size to use if one is not specified
     */
    private static defaultItemSize = 50;

    /**
     * Viewport buffer to use if one is not specified
     */
    private static defaultViewportBuffer = 100;

    /**
     * The sizemap for the items
     * Authors need to provide a sizemap for arrays of irregular size items,
     * when the items have a uniform size use the 'item-size' attribute instead.
     *
     * @public
     */
    @observable
    public sizemap: SizeMap[];
    // private sizemapChanged(previous: SizeMap[]): void {
    //     if (this.$fastController.isConnected) {
    //         this.observeSizeMap();
    //         this.updateDimensions();
    //     }
    // }

    /**
     * The HTML element being used as the viewport
     *
     * @public
     */
    @observable
    public viewportElement: HTMLElement;
    //     private viewportElementChanged(): void {
    //         if (this.$fastController.isConnected) {
    //             this.resetAutoUpdateMode(this.autoUpdateMode, this.autoUpdateMode);
    //         }
    //     }

    //     /**
    //      * The default ViewTemplate used to render items vertically.
    //      *
    //      * @internal
    //      */
    //     @observable
    //     public defaultVerticalItemTemplate: ViewTemplate;

    //     /**
    //      * The default ViewTemplate used to render items horizontally.
    //      *
    //      * @internal
    //      */
    //     @observable
    //     public defaultHorizontalItemTemplate: ViewTemplate;

    /**
     * The items that are currently visible (includes buffer regions).
     * This is the array used by the component repeat directive.
     *
     * @internal
     */
    @observable
    public visibleItems: object[] = [];

    /**
     * The positions of the currently rendered items in the list
     *
     * @internal
     */
    @observable
    public visibleItemMap: SizeMap[] = [];

    /**
     * The calculated size of the total stack.
     * (ie. all items + start/end regions)
     *
     * @internal
     */
    @observable
    public totalListSize: number = 0;

    /**
     * The size in pixels of the start "spacer"
     * (ie. the grid region that holds space for non-rendered elements at the start of the stack)
     *
     * @internal
     */
    @observable
    public startSpacerSize: number = 0;

    /**
     * The size in pixels of the end "spacer"
     * (ie. the grid region that holds space for non-rendered elements at the end of the stack)
     *
     * @internal
     */
    @observable
    public endSpacerSize: number = 0;

    /**
     * The index of the first item in the array to be rendered
     *
     * @internal
     */
    @observable
    public firstRenderedIndex: number = -1;

    /**
     * The index of the last item in the array to be rendered
     *
     * @internal
     */
    @observable
    public lastRenderedIndex: number = -1;

    private parentElement: DataList | undefined;

    // reference to the repeat behavior used to render items
    private itemsRepeatBehavior: RepeatBehavior | null = null;

    // the placeholder element used by the repeat behavior
    private itemsPlaceholder: Node;

    public connect(parent: DataList) {
        console.debug("virtualconnect");
        this.parentElement = parent;
        if (this.itemsPlaceholder === undefined) {
            this.itemsPlaceholder = document.createComment("");
            this.parentElement.appendChild(this.itemsPlaceholder);
        }

        this.initializeRepeatBehavior();
    }

    public disconnect() {
        if (this.parentElement) {
            this.parentElement.$fastController.removeBehaviors([
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                this.itemsRepeatBehavior!,
            ]);
            this.parentElement = undefined;
        }
    }

    /**
     * initialize repeat behavior
     */
    private initializeRepeatBehavior(): void {
        if (!this.parentElement || this.itemsRepeatBehavior !== null) {
            return;
        }

        const itemsRepeatDirective = new RepeatDirective<DataList>(
            bind(x => x.items, false),
            bind(x => x.itemTemplate, false),
            { positioning: true, recycle: this.parentElement.recycle }
        );
        this.itemsRepeatBehavior = itemsRepeatDirective.createBehavior({
            [itemsRepeatDirective.nodeId]: this.itemsPlaceholder,
        });

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.parentElement.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }
}
