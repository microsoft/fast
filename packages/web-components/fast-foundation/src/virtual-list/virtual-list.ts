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
 * @beta
 */
export type VirtualListAutoUpdateMode = "manual" | "viewport-resize" | "auto";

/**
 * Used to describe the position of an element within the list
 *
 * @beta
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
     * @beta
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
     * @beta
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
     * @beta
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
     * @beta
     * @remarks
     * HTML Attribute: viewport-buffer
     */
    @attr({ attribute: "viewport-buffer", converter: nullableNumberConverter })
    public viewportBuffer: number = 100;

    /**
     * Whether the list is oriented vertically or horizontally.
     * Default is vertical
     *
     * @beta
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
     * @beta
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
     * The HTML element being used as the viewport
     *
     * @beta
     */
    @observable
    public viewportElement: HTMLElement;
    private viewportElementChanged(): void {
        if ((this as FoundationElement).$fastController.isConnected) {
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
     * The ViewTemplate used to render item contents. This behavior depends
     * on the itemTemplate using virtual-item or equivalent to render list items.
     *
     * @public
     */
    @observable
    public itemContentsTemplate: ViewTemplate;

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

    private static intersectionService: IntersectionService = new IntersectionService();
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    private pendingPositioningUpdate: boolean = false;
    private pendingReset: boolean = false;

    private visibleRangeStart: number = 0;
    private visibleRangeEnd: number = 0;

    private viewportRect: ClientRect | DOMRect | undefined;
    private containerRect: ClientRect | DOMRect | undefined;

    private itemsRepeatBehavior: RepeatBehavior | null = null;
    private itemsPlaceholder: Node;

    private itemsObserver: Notifier | null = null;
    private itemCount: number = 0;

    private finalUpdate: boolean = false;

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

        if (this.itemCount !== this.items.length) {
            this.itemCount = this.items.length;
            this.updateDimensions();
        }
        this.requestPositionUpdates();
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
    public getGeneratedItemPosition(itemIndex: number): number {
        if (itemIndex < 0 || itemIndex >= this.items.length) {
            // out of range
            return 0;
        }

        let returnVal = 0;

        if (this.visibleItemSpans !== undefined) {
            // todo
            returnVal = 0;
        } else {
            returnVal = itemIndex * this.itemSpan;
        }

        return returnVal;
    }

    /**
     * get position updates
     */
    public requestPositionUpdates(): void {
        if (!this.virtualize) {
            this.updateVisibleItems();
            return;
        }
        if (this.pendingPositioningUpdate) {
            this.finalUpdate = true;
            return;
        }
        this.finalUpdate = false;
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
            { positioning: true, recycle: false }
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
     * updates the dimensions of the stack
     */
    private updateDimensions(): void {
        this.totalListSpan = this.itemSpan * (this.items?.length ?? 0);
        this.requestPositionUpdates();
    }

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

        if (viewportStart >= containerEnd) {
            this.visibleRangeStart = containerSpan;
            this.visibleRangeEnd = containerSpan;
        } else if (viewportEnd <= containerStart) {
            this.visibleRangeStart = 0;
            this.visibleRangeEnd = 0;
        } else {
            this.visibleRangeStart = viewportStart - containerStart - this.viewportBuffer;
            this.visibleRangeEnd =
                containerSpan - (containerEnd - (viewportEnd + this.viewportBuffer));

            this.visibleRangeStart =
                this.visibleRangeStart < 0 ? 0 : this.visibleRangeStart;
            this.visibleRangeEnd =
                this.visibleRangeEnd > containerSpan
                    ? containerSpan
                    : this.visibleRangeEnd;
        }

        let newFirstRenderedIndex: number = Math.floor(
            this.visibleRangeStart / this.itemSpan
        );
        const visibleRangeLength = this.visibleRangeEnd - this.visibleRangeStart;
        let newLastRenderedIndex: number =
            newFirstRenderedIndex + Math.ceil(visibleRangeLength / this.itemSpan);

        newFirstRenderedIndex = Math.max(0, newFirstRenderedIndex);
        newLastRenderedIndex = Math.min(newLastRenderedIndex, this.items.length - 1);

        this.startSpacerSpan = newFirstRenderedIndex * this.itemSpan;
        this.endSpacerSpan =
            (this.items.length - newLastRenderedIndex - 1) * this.itemSpan;

        const newVisibleItems = this.items.slice(
            newFirstRenderedIndex,
            newLastRenderedIndex + 1
        );

        this.visibleItems.splice(0, this.visibleItems.length, ...newVisibleItems);
        this.updateVisibleItemSpans(newFirstRenderedIndex, newLastRenderedIndex);
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

        for (let i = newFirstRenderedIndex; i <= newLastRenderedIndex; i++) {
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

        if (this.finalUpdate) {
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
