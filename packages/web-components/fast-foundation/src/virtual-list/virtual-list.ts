import {
    attr,
    DOM,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable,
    RepeatBehavior,
    RepeatDirective,
    Splice,
    ViewTemplate,
} from "@microsoft/fast-element";
import { eventResize, eventScroll, Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
import { IntersectionService } from "../utilities/intersection-service";
import { IdleCallbackQueue } from "../utilities/idle-callback-queue";
import type {
    ResizeObserverClassDefinition,
    ResizeObserverEntry,
} from "../utilities/resize-observer";
import type {
    SizeMap,
    VirtualListItem,
    VirtualListItemLoadMode,
} from "./virtual-list-item";

/**
 * Defines when the component updates its position automatically.
 *
 * @public
 */
export type VirtualListAutoUpdateMode = "manual" | "viewport-resize" | "auto";

/**
 *  The VirtualList class
 *
 * @public
 */
export class VirtualList extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @attr({ attribute: "list-item-load-mode" })
    public listItemLoadMode: VirtualListItemLoadMode;

    /**
     *  Whether or not the display should virtualize
     *
     * @public
     */
    @attr({ attribute: "virtualization-enabled", mode: "boolean" })
    public virtualizationEnabled: boolean = true;
    private virtualizationEnabledChanged(): void {
        if (this.$fastController.isConnected) {
            this.reset();
        }
    }

    /**
     * The HTML ID of the viewport element
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    @attr({ attribute: "viewport" })
    public viewport: string = "";
    private viewportChanged(): void {
        if (this.$fastController.isConnected) {
            this.viewportElement = this.getViewport();
            this.updateDimensions();
        }
    }

    /**
     * The size in pixels of each item along the virtualization axis
     *
     * @public
     * @remarks
     * HTML Attribute: item-size
     */
    @attr({ attribute: "item-size", converter: nullableNumberConverter })
    public itemSize: number = 50;
    private itemSizeChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateDimensions();
        }
    }

    /**
     * Defines an area in pixels on either end of the viewport where items outside the viewport
     * will still be rendered.
     *
     * @public
     * @remarks
     * HTML Attribute: viewport-buffer
     */
    @attr({ attribute: "viewport-buffer", converter: nullableNumberConverter })
    public viewportBuffer: number = 100;

    /**
     * Whether the list is oriented vertically or horizontally.
     * Default is vertical
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: Orientation = Orientation.vertical;
    private orientationChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateDimensions();
        }
    }

    /**
     * Auto update mode defines what prompts the component to check the dimensions of elements
     * in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.
     *
     * @public
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    @attr({ attribute: "auto-update-mode" })
    public autoUpdateMode: VirtualListAutoUpdateMode = "manual";
    private autoUpdateModeChanged(
        prevMode: VirtualListAutoUpdateMode,
        newMode: VirtualListAutoUpdateMode
    ): void {
        if (this.$fastController.isConnected) {
            this.resetAutoUpdateMode(prevMode, newMode);
        }
    }

    /**
     * Whether or not to recycle the html container used to display items.
     * May help performance but containers may retain artifacts from previous use that
     * developers will need to clear.
     *
     * @public
     */
    @attr({ attribute: "recycle", mode: "boolean" })
    public recycle: boolean = true;

    /**
     *  The array of items to be displayed
     *
     * @public
     */
    @observable
    public items: object[] = [];
    private itemsChanged(): void {
        if (this.$fastController.isConnected) {
            this.reset();
        }
    }

    /**
     * The sizemap for the items
     * Authors need to provide a sizemap for arrays of irregular size items,
     * when the items have a uniform size use the 'item-size' attribute instead.
     *
     * @public
     */
    @observable
    public sizemap: SizeMap[];
    private sizemapChanged(previous: SizeMap[]): void {
        if (this.$fastController.isConnected) {
            this.observeSizeMap();
            this.updateDimensions();
        }
    }

    /**
     * The HTML element being used as the viewport
     *
     * @public
     */
    @observable
    public viewportElement: HTMLElement;
    private viewportElementChanged(): void {
        if (this.$fastController.isConnected) {
            this.resetAutoUpdateMode(this.autoUpdateMode, this.autoUpdateMode);
        }
    }

    /**
     * The ViewTemplate used to render items.
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate;

    /**
     * Used to pass custom context objects to list items.
     *
     * @public
     */
    @observable
    public listItemContext: object;

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
     * The items that are currently visible (includes buffer regions)
     *
     * @internal
     */
    @observable
    public visibleItems: any[] = [];

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

    /**
     * the idle callback queue for this list instance
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

    // reference to the intersection service to request position updates
    private static intersectionService: IntersectionService = new IntersectionService();

    // reference to the resize observer used to detect viewport resize events
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    // whether there is a pending position update
    // (ie. an intersection service is in progress)
    private pendingPositioningUpdate: boolean = false;

    // whether a reset is already queued
    private pendingReset: boolean = false;

    // stored geometry for the viewport and internal container elements
    private viewportRect: ClientRect | DOMRect | undefined;
    private containerRect: ClientRect | DOMRect | undefined;

    // reference to the repeat behavior used to render items
    private itemsRepeatBehavior: RepeatBehavior | null = null;

    // the placeholder element used by the repeat behavior
    private itemsPlaceholder: Node;

    // notifier used to trigger updates after changes to items array
    private itemsObserver: Notifier | null = null;

    // notifier used to trigger updates after changes to sizemap array
    private sizemapObserver: Notifier | null = null;

    /**
     * flag that indicates whether an additional position update should be requested
     * after the current one resolves (ie. possible geometry changes after the last request)
     */
    private finalUpdateNeeded: boolean = false;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();

        this.idleCallbackQueue.idleCallbackTimeout = this.idleCallbackTimeout;
        this.viewportElement = this.viewportElement ?? this.getViewport();
        this.resetAutoUpdateMode("manual", this.autoUpdateMode);

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
        this.initializeResizeDetector();
        this.doReset();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.autoUpdateMode === "auto") {
            this.stopViewportResizeDetector();
        }
        this.cancelPendingPositionUpdates();
        this.unobserveItems();
        this.unobserveSizeMap();
        this.visibleItems = this.visibleItems.splice(0, this.visibleItems.length);
        this.visibleItemMap = [];
        this.disconnectResizeDetector();
    }

    /**
     * Request a layout update
     *
     * @public
     */
    public update(): void {
        this.requestPositionUpdates();
    }

    /**
     * the position in the stack (in pixels) of the a particular item index in the
     * base source data.  Note that this does not necessarily mean the item is currently
     * being rendered.
     *
     * @public
     */
    public getItemSizeMap = (itemIndex: number): SizeMap | null => {
        if (itemIndex < 0 || itemIndex >= this.items.length) {
            // out of range
            return null;
        }

        if (this.sizemap !== undefined) {
            return this.sizemap[itemIndex];
        }

        return {
            start: itemIndex * this.itemSize,
            end: itemIndex * this.itemSize + this.itemSize,
            size: this.itemSize,
        };
    };

    /**
     * starts observing the items array
     */
    private observeItems(): void {
        this.unobserveItems();

        if (!this.items) {
            return;
        }

        // TODO:  we don't use splices calculated by array change events
        // look for cheaper observer implementation later

        const newObserver = (this.itemsObserver = Observable.getNotifier(this.items));
        newObserver.subscribe(this);
    }

    /**
     * stops observing the items array
     */
    private unobserveItems(): void {
        this.itemsObserver?.unsubscribe(this);
        this.itemsObserver = null;
    }

    /**
     * starts observing the items array
     */
    private observeSizeMap(): void {
        this.unobserveSizeMap();

        if (!this.sizemap) {
            return;
        }

        // TODO:  we don't use splices calculated by array change events
        // look for cheaper observer implementation later

        const newObserver = (this.sizemapObserver = Observable.getNotifier(this.sizemap));
        newObserver.subscribe(this);
    }

    /**
     * stops observing the items array
     */
    private unobserveSizeMap(): void {
        this.sizemapObserver?.unsubscribe(this);
        this.sizemapObserver = null;
    }

    /**
     * The items list has mutated
     *
     * @internal
     */
    public handleChange(source: any, splices: Splice[]): void {
        if (source === this.items) {
            const itemsLength = this.items.length;
            const firstRenderedIndex = Math.min(this.firstRenderedIndex, itemsLength - 1);
            const lastRenderedIndex = Math.min(this.lastRenderedIndex, itemsLength - 1);

            const newVisibleItems = this.items.slice(
                firstRenderedIndex,
                lastRenderedIndex + 1
            );

            this.visibleItems.splice(0, this.visibleItems.length, ...newVisibleItems);

            this.updateDimensions();
            this.requestPositionUpdates();
        } else if (source === this.sizemap) {
            this.updateDimensions();
        }
    }

    /**
     * get position updates
     */
    protected requestPositionUpdates(): void {
        if (!this.virtualizationEnabled) {
            this.updateVisibleItems();
            return;
        }
        if (this.pendingPositioningUpdate) {
            this.finalUpdateNeeded = true;
            return;
        }
        this.finalUpdateNeeded = false;
        this.pendingPositioningUpdate = true;

        VirtualList.intersectionService.requestPosition(
            this.containerElement,
            this.handleIntersection
        );
        VirtualList.intersectionService.requestPosition(
            this.viewportElement,
            this.handleIntersection
        );
    }

    /**
     * request reset
     */
    protected reset(): void {
        if (this.pendingReset) {
            return;
        }

        this.pendingReset = true;

        DOM.queueUpdate(() => {
            this.doReset();
        });
    }

    /**
     * execute reset
     */
    private doReset(): void {
        this.pendingReset = false;
        this.cancelPendingPositionUpdates();
        this.observeItems();
        this.observeSizeMap();
        this.updateDimensions();
    }

    /**
     * initialize repeat behavior for visible items
     */
    private initializeRepeatBehavior(): void {
        if (this.itemsRepeatBehavior !== null) {
            return;
        }

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.visibleItems,
            x => x.itemTemplate,
            { positioning: true, recycle: this.recycle }
        ).createBehavior(this.itemsPlaceholder);
        this.$fastController.addBehaviors([this.itemsRepeatBehavior]);
    }

    /**
     * cancel any pending position update requests
     */
    private cancelPendingPositionUpdates(): void {
        if (this.pendingPositioningUpdate) {
            this.pendingPositioningUpdate = false;
            VirtualList.intersectionService.cancelRequestPosition(
                this.containerElement,
                this.handleIntersection
            );
            if (this.viewportElement !== null) {
                VirtualList.intersectionService.cancelRequestPosition(
                    this.viewportElement,
                    this.handleIntersection
                );
            }
        }
    }

    /**
     * Handles changes to auto-update-mode
     */
    private resetAutoUpdateMode(
        prevMode: VirtualListAutoUpdateMode,
        newMode: VirtualListAutoUpdateMode
    ): void {
        switch (prevMode) {
            case "auto":
                this.stopViewportResizeDetector();
                this.stopWindowEventListeners();
                break;

            case "viewport-resize":
                this.stopViewportResizeDetector();
                break;
        }

        switch (newMode) {
            case "auto":
                this.startViewportResizeDetector();
                this.startWindowUpdateEventListeners();
                break;

            case "viewport-resize":
                this.startViewportResizeDetector();
                break;
        }
    }

    /**
     * initializes the instance's resize observer
     */
    private initializeResizeDetector(): void {
        if (this.resizeDetector !== null) {
            return;
        }
        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.resizeDetected.bind(this)
        );
        this.resizeDetector.observe(this);
    }

    /**
     * destroys the instance's resize observer
     */
    private disconnectResizeDetector(): void {
        if (this.resizeDetector !== null) {
            this.resizeDetector.unobserve(this);
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }

    private resizeDetected(entries: ResizeObserverEntry[]): void {
        let itemsResized: boolean = false;
        const newMap: SizeMap[] = this.sizemap.slice(0);

        entries.forEach((entry: ResizeObserverEntry) => {
            if (entry.target === this.viewportElement || entry.target === this) {
                this.requestPositionUpdates();
                return;
            } else {
                itemsResized = true;
                const index: number = (entry.target as VirtualListItem).itemIndex;
                const itemSizeMap: SizeMap = {
                    start: newMap[index].start,
                    size:
                        this.orientation === Orientation.vertical
                            ? entry.contentRect.height
                            : entry.contentRect.width,
                    end: newMap[index].end,
                };
                newMap.splice(index, 1, itemSizeMap);
            }
            if (!itemsResized) {
                return;
            }

            const mapLength: number = this.sizemap.length;

            let currentPosition: number = 0;
            for (let i: number = 0; i < mapLength; i++) {
                const nextPosition = currentPosition + newMap[i].size;
                newMap.splice(i, 1, {
                    start: currentPosition,
                    size: newMap[i].size,
                    end: nextPosition,
                });
                currentPosition = nextPosition;
            }

            this.sizemap = newMap;
        });
    }

    /**
     * starts the viewport resize detector
     */
    private startViewportResizeDetector(): void {
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.observe(this.viewportElement);
        }
    }

    /**
     * stops the viewport resize detector
     */
    private stopViewportResizeDetector(): void {
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.unobserve(this.viewportElement);
        }
    }

    /**
     * starts window level event listeners that can trigger auto updating
     * (scroll and resize)
     */
    private startWindowUpdateEventListeners(): void {
        window.addEventListener(eventResize, this.handleResizeEvent, {
            passive: true,
        });
        window.addEventListener(eventScroll, this.handleScrollEvent, {
            passive: true,
            capture: true,
        });
    }

    /**
     * handle scroll events
     */
    private handleScrollEvent = (e: Event): void => {
        this.requestPositionUpdates();
    };

    /**
     * handle resize events
     */
    private handleResizeEvent = (e: Event): void => {
        this.requestPositionUpdates();
    };

    /**
     * stops event listeners that can trigger auto updating
     */
    private stopWindowEventListeners(): void {
        window.removeEventListener(eventResize, this.requestPositionUpdates);
        window.removeEventListener(eventScroll, this.requestPositionUpdates);
    }

    /**
     * Gets the viewport element by id, or defaults to element
     */
    private getViewport(): HTMLElement {
        return document.getElementById(this.viewport) ?? this;
    }

    /**
     * updates the dimensions of the list
     */
    private updateDimensions = (): void => {
        if (this.items === undefined) {
            this.totalListSize = 0;
            return;
        }
        if (this.sizemap !== undefined) {
            this.totalListSize =
                this.sizemap.length > 0 ? this.sizemap[this.sizemap.length - 1].end : 0;
        } else {
            this.totalListSize = this.itemSize * this.items.length;
        }

        this.requestPositionUpdates();
    };

    /**
     *  Updates the visible items
     */
    private updateVisibleItems(): void {
        if (!this.items) {
            return;
        }

        if (!this.virtualizationEnabled) {
            this.visibleItems.splice(0, this.visibleItems.length, ...this.items);
            this.updateVisibleItemSizes(0, this.visibleItems.length - 1);
            return;
        }

        if (!this.containerRect || !this.viewportRect) {
            return;
        }

        let { top: viewportStart, bottom: viewportEnd } = this.viewportRect;

        let {
            top: containerStart,
            bottom: containerEnd,
            height: containerSize,
        } = this.containerRect;

        if (this.orientation === Orientation.horizontal) {
            ({ left: viewportStart, right: viewportEnd } = this.viewportRect);
            ({
                left: containerStart,
                right: containerEnd,
                width: containerSize,
            } = this.containerRect);
        }

        let renderedRangeStart = this.firstRenderedIndex;
        let renderedRangeEnd = this.lastRenderedIndex;

        if (viewportStart >= containerEnd) {
            renderedRangeStart = containerSize;
            renderedRangeEnd = containerSize;
        } else if (viewportEnd <= containerStart) {
            renderedRangeStart = 0;
            renderedRangeEnd = 0;
        } else {
            renderedRangeStart = viewportStart - containerStart - this.viewportBuffer;
            renderedRangeEnd =
                containerSize - (containerEnd - (viewportEnd + this.viewportBuffer));

            renderedRangeStart = renderedRangeStart < 0 ? 0 : renderedRangeStart;
            renderedRangeEnd =
                renderedRangeEnd > containerSize ? containerSize : renderedRangeEnd;
        }

        const visibleRangeLength = renderedRangeEnd - renderedRangeStart;
        let newFirstRenderedIndex: number = 0;
        let newLastRenderedIndex: number = 0;

        if (this.sizemap === undefined) {
            newFirstRenderedIndex = Math.floor(renderedRangeStart / this.itemSize);
            newLastRenderedIndex =
                newFirstRenderedIndex + Math.ceil(visibleRangeLength / this.itemSize);

            newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
            newLastRenderedIndex = Math.min(newLastRenderedIndex, this.items.length - 1);

            this.startSpacerSize = newFirstRenderedIndex * this.itemSize;
            this.endSpacerSize =
                (this.items.length - newLastRenderedIndex - 1) * this.itemSize;
        } else {
            const firstVisibleItem: SizeMap | undefined = this.sizemap.find(
                x => x.end >= renderedRangeStart
            );
            if (firstVisibleItem !== undefined) {
                newFirstRenderedIndex = this.sizemap.indexOf(firstVisibleItem);
                const lastVisibleItem: SizeMap | undefined = this.sizemap.find(
                    x => x.start >= renderedRangeEnd
                );
                newLastRenderedIndex =
                    lastVisibleItem === undefined
                        ? this.sizemap.length - 1
                        : this.sizemap.indexOf(lastVisibleItem);
            }

            newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
            newLastRenderedIndex = Math.min(newLastRenderedIndex, this.items.length - 1);

            this.startSpacerSize = this.sizemap[newFirstRenderedIndex].start;
            this.endSpacerSize =
                this.sizemap[this.sizemap.length - 1].end -
                this.sizemap[newLastRenderedIndex].end;
        }

        const newVisibleItems = this.items.slice(
            newFirstRenderedIndex,
            newLastRenderedIndex + 1
        );

        this.updateVisibleItemSizes(newFirstRenderedIndex, newLastRenderedIndex);
        this.visibleItems.splice(0, this.visibleItems.length, ...newVisibleItems);
    }

    /**
     *  Updates the size maps
     */
    private updateVisibleItemSizes(
        newFirstRenderedIndex: number,
        newLastRenderedIndex: number
    ): void {
        const newVisibleItemSizes: SizeMap[] = [];

        let top: number = this.startSpacerSize;

        if (this.sizemap === undefined) {
            for (let i: number = newFirstRenderedIndex; i <= newLastRenderedIndex; i++) {
                const thisSizeMap: SizeMap = {
                    start: top,
                    end: top + this.itemSize,
                    size: this.itemSize,
                };
                top = thisSizeMap.end;
                newVisibleItemSizes.push(thisSizeMap);
            }
        } else {
            for (let i: number = newFirstRenderedIndex; i <= newLastRenderedIndex; i++) {
                const thisSizeMap: SizeMap = {
                    start: this.sizemap[i].start,
                    end: this.sizemap[i].end,
                    size: this.sizemap[i].size,
                };
                top = thisSizeMap.end;
                newVisibleItemSizes.push(thisSizeMap);
            }
        }

        this.visibleItemMap = newVisibleItemSizes;

        this.updateRenderedRange(newFirstRenderedIndex, newLastRenderedIndex);
    }

    /**
     *  Updates the range of rendered items
     */
    private updateRenderedRange(
        newFirstRenderedIndex: number,
        newLastRenderedIndex: number
    ): void {
        if (
            newFirstRenderedIndex === this.firstRenderedIndex &&
            newLastRenderedIndex === this.lastRenderedIndex
        ) {
            return;
        }

        this.firstRenderedIndex = newFirstRenderedIndex;
        this.lastRenderedIndex = newLastRenderedIndex;

        this.$emit("renderedrangechange", this, { bubbles: false });
    }

    /**
     *  Handle intersections
     */
    private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        if (!this.pendingPositioningUpdate) {
            return;
        }

        this.pendingPositioningUpdate = false;

        if (this.finalUpdateNeeded) {
            this.requestPositionUpdates();
        }

        const containerEntry = entries.find(x => x.target === this.containerElement);
        const viewportEntry = entries.find(x => x.target === this.viewportElement);

        if (!containerEntry || !viewportEntry) {
            return;
        }

        const documentElement = document.documentElement;
        let viewportRect = viewportEntry.boundingClientRect;
        if (this.viewportElement === documentElement) {
            viewportRect = new DOMRectReadOnly(
                viewportRect.x + documentElement.scrollLeft,
                viewportRect.y + documentElement.scrollTop,
                viewportRect.width,
                viewportRect.height
            );
        }
        this.containerRect = containerEntry.boundingClientRect;
        this.viewportRect = viewportRect;

        this.updateVisibleItems();
    };
}
