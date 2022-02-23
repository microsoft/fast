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
import type { ResizeObserverClassDefinition } from "../utilities/resize-observer";

/**
 * Defines when the component updates its position automatically.
 *
 * @public
 */
export type VirtualListAutoUpdateMode = "manual" | "viewport-resize" | "auto";

/**
 * Used to describe the position of an element within the list
 *
 * @public
 */
export interface SpanMap {
    start: number;
    end: number;
    span: number;
}

/**
 *  The VirtualList class
 *
 * @public
 */
export class VirtualList extends FoundationElement {
    /**
     *  Whether or not the display should virtualize
     *
     * @public
     */
    @attr({ attribute: "virtualize", mode: "boolean" })
    public virtualize: boolean = true;
    private virtualizeChanged(): void {
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
     * The span in pixels of each item along the virtualization axis
     *
     * @public
     * @remarks
     * HTML Attribute: item-span
     */
    @attr({ attribute: "item-span", converter: nullableNumberConverter })
    public itemSpan: number = 50;
    private itemSpanChanged(): void {
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
    // private recycleChanged(): void {
    //     if (this.$fastController.isConnected) {
    //         TODO: implement this
    //     }
    // }

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
     * The spanmap for the items
     * Authors need to provide a spanmap for arrays of irregular span items,
     * when the items have a uniform span use the 'item-span' attribute instead.
     *
     * @public
     */
    @observable
    public spanmap: SpanMap[];
    private spanmapChanged(): void {
        if (this.$fastController.isConnected) {
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
    public visibleItemSpans: SpanMap[] = [];

    /**
     * The calculated span of the total stack.
     * (ie. all items + start/end regions)
     *
     * @internal
     */
    @observable
    public totalListSpan: number = 0;

    /**
     * The size in pixels of the start "spacer"
     * (ie. the grid region that holds space for non-rendered elements at the start of the stack)
     *
     * @internal
     */
    @observable
    public startSpacerSpan: number = 0;

    /**
     * The size in pixels of the end "spacer"
     * (ie. the grid region that holds space for non-rendered elements at the end of the stack)
     *
     * @internal
     */
    @observable
    public endSpacerSpan: number = 0;

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
        this.visibleItems = this.visibleItems.splice(0, this.visibleItems.length);
        this.visibleItemSpans = this.visibleItemSpans.splice(
            0,
            this.visibleItemSpans.length
        );
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
    public getItemSpanMap = (itemIndex: number): SpanMap | null => {
        if (itemIndex < 0 || itemIndex >= this.items.length) {
            // out of range
            return null;
        }

        if (this.spanmap !== undefined) {
            return this.spanmap[itemIndex];
        }

        return {
            start: itemIndex * this.itemSpan,
            end: itemIndex * this.itemSpan + this.itemSpan,
            span: this.itemSpan,
        };
    };

    /**
     * starts observing the items array
     */
    private observeItems(): void {
        if (!this.items) {
            return;
        }

        this.unobserveItems();

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
     * The items list has mutated
     *
     * @internal
     */
    public handleChange(source: any, splices: Splice[]): void {
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
    }

    /**
     * get position updates
     */
    protected requestPositionUpdates(): void {
        if (!this.virtualize) {
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
            this.requestPositionUpdates.bind(this)
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
            this.totalListSpan = 0;
            return;
        }
        if (this.spanmap !== undefined) {
            this.totalListSpan =
                this.spanmap.length > 0 ? this.spanmap[this.spanmap.length - 1].end : 0;
        } else {
            this.totalListSpan = this.itemSpan * this.items.length;
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

        if (!this.virtualize) {
            this.visibleItems.splice(0, this.visibleItems.length, ...this.items);
            this.updateVisibleItemSpans(0, this.visibleItems.length - 1);
            return;
        }

        if (!this.containerRect || !this.viewportRect) {
            return;
        }

        let { top: viewportStart, bottom: viewportEnd } = this.viewportRect;

        let {
            top: containerStart,
            bottom: containerEnd,
            height: containerSpan,
        } = this.containerRect;

        if (this.orientation === Orientation.horizontal) {
            ({ left: viewportStart, right: viewportEnd } = this.viewportRect);
            ({
                left: containerStart,
                right: containerEnd,
                width: containerSpan,
            } = this.containerRect);
        }

        let renderedRangeStart = this.firstRenderedIndex;
        let renderedRangeEnd = this.lastRenderedIndex;

        if (viewportStart >= containerEnd) {
            renderedRangeStart = containerSpan;
            renderedRangeEnd = containerSpan;
        } else if (viewportEnd <= containerStart) {
            renderedRangeStart = 0;
            renderedRangeEnd = 0;
        } else {
            renderedRangeStart = viewportStart - containerStart - this.viewportBuffer;
            renderedRangeEnd =
                containerSpan - (containerEnd - (viewportEnd + this.viewportBuffer));

            renderedRangeStart = renderedRangeStart < 0 ? 0 : renderedRangeStart;
            renderedRangeEnd =
                renderedRangeEnd > containerSpan ? containerSpan : renderedRangeEnd;
        }

        const visibleRangeLength = renderedRangeEnd - renderedRangeStart;
        let newFirstRenderedIndex: number = 0;
        let newLastRenderedIndex: number = 0;

        if (this.spanmap === undefined) {
            newFirstRenderedIndex = Math.floor(renderedRangeStart / this.itemSpan);
            newLastRenderedIndex =
                newFirstRenderedIndex + Math.ceil(visibleRangeLength / this.itemSpan);

            newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
            newLastRenderedIndex = Math.min(newLastRenderedIndex, this.items.length - 1);

            this.startSpacerSpan = newFirstRenderedIndex * this.itemSpan;
            this.endSpacerSpan =
                (this.items.length - newLastRenderedIndex - 1) * this.itemSpan;
        } else {
            const firstVisibleItem: SpanMap | undefined = this.spanmap.find(
                x => x.end >= renderedRangeStart
            );
            if (firstVisibleItem !== undefined) {
                newFirstRenderedIndex = this.spanmap.indexOf(firstVisibleItem);
                const lastVisibleItem: SpanMap | undefined = this.spanmap.find(
                    x => x.start >= renderedRangeEnd
                );
                newLastRenderedIndex =
                    lastVisibleItem === undefined
                        ? this.spanmap.length - 1
                        : this.spanmap.indexOf(lastVisibleItem);
            }

            newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
            newLastRenderedIndex = Math.min(newLastRenderedIndex, this.items.length - 1);

            this.startSpacerSpan = this.spanmap[newFirstRenderedIndex].start;
            this.endSpacerSpan =
                this.spanmap[this.spanmap.length - 1].end -
                this.spanmap[newLastRenderedIndex].end;
        }

        const newVisibleItems = this.items.slice(
            newFirstRenderedIndex,
            newLastRenderedIndex + 1
        );

        this.updateVisibleItemSpans(newFirstRenderedIndex, newLastRenderedIndex);
        this.visibleItems.splice(0, this.visibleItems.length, ...newVisibleItems);
    }

    /**
     *  Updates the span map
     */
    private updateVisibleItemSpans(
        newFirstRenderedIndex: number,
        newLastRenderedIndex: number
    ): void {
        const newVisibleItemSpans: SpanMap[] = [];

        let top: number = this.startSpacerSpan;

        if (this.spanmap === undefined) {
            for (let i: number = newFirstRenderedIndex; i <= newLastRenderedIndex; i++) {
                const thisSpanMap: SpanMap = {
                    start: top,
                    end: top + this.itemSpan,
                    span: this.itemSpan,
                };
                top = thisSpanMap.end;
                newVisibleItemSpans.push(thisSpanMap);
            }

            this.visibleItemSpans.splice(
                0,
                this.visibleItemSpans.length,
                ...newVisibleItemSpans
            );
        } else {
            this.visibleItemSpans.splice(
                0,
                this.visibleItemSpans.length,
                ...this.spanmap.slice(newFirstRenderedIndex, newLastRenderedIndex + 1)
            );
        }

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

        this.$emit("rendered-range-change", this, { bubbles: false });
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
