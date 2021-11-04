import {
    attr,
    DOM,
    html,
    nullableNumberConverter,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import { eventResize, eventScroll, Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
import { IntersectionService } from "../anchored-region/intersection-service";
import type { ResizeObserverClassDefinition } from "../anchored-region/resize-observer";

/**
 * Defines if the component updates its position automatically. Calling update() always provokes an update.
 *
 * @beta
 */
export type VirtualizingStackAutoUpdateMode = "manual" | "resize-only" | "auto";

const defaultItemTemplate: ViewTemplate<any> = html`
    <div
        style="
            height: 100%;
            width: 100%;
            grid-row: ${(x, c) =>
            c.parent.orientation === Orientation.vertical
                ? c.index + c.parent.virtualizedIndexOffset
                : 1};
            grid-column: ${(x, c) =>
            c.parent.orientation === Orientation.horizontal
                ? c.index + c.parent.virtualizedIndexOffset
                : 1};
        "
    >
        ${x => x}
    </div>
`;

/**
 *
 *
 * @public
 */
export class VirtualizingStackBase extends FoundationElement {
    /**
     *
     *
     * @public
     */
    @observable
    public items: object[];
    private itemsChanged(): void {
        this.reset();
    }

    /**
     *
     *
     * @beta
     */
    @attr({ attribute: "virtualize" })
    public virtualize: boolean = true;
    // private virtualizeChanged(): void {
    // }

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
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: item-span
     */
    @attr({ attribute: "item-span" })
    public itemSpan: number;
    private itemSpanChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateDimensions();
        }
    }

    /**
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: viewport-buffer
     */
    @attr({ attribute: "viewport-buffer" })
    public viewportBuffer: number = 100;

    /**
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: layout-update-delay
     */
    @attr({ attribute: "layout-update-delay", converter: nullableNumberConverter })
    public layoutUpdateDelay: number = 0;

    /**
     *
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
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    @attr({ attribute: "auto-update-mode" })
    public autoUpdateMode: VirtualizingStackAutoUpdateMode = "auto";
    private autoUpdateModeChanged(
        prevMode: VirtualizingStackAutoUpdateMode,
        newMode: VirtualizingStackAutoUpdateMode
    ): void {
        if (this.$fastController.isConnected) {
            if (prevMode === "auto") {
                this.stopAutoUpdateEventListeners();
            }

            if (newMode === "auto") {
                this.startAutoUpdateEventListeners();
            }
        }
    }

    /**
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: start-region-span
     */
    @attr({ attribute: "start-region-span", converter: nullableNumberConverter })
    public startRegionSpan: number = 0;
    private startRegionSpanChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateDimensions();
        }
    }

    /**
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: end-region-span
     */
    @attr({ attribute: "end-region-span", converter: nullableNumberConverter })
    public endRegionSpan: number = 0;
    private endItemSpansChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateDimensions();
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
            // this.initialize();
        }
    }

    /**
     *
     *
     * @public
     */
    @observable
    public spanMap: number[];
    private spanChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateDimensions();
        }
    }

    /**
     *
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate = defaultItemTemplate;

    /**
     *
     *  Accounts for css grids not being zero based, the spacer span, and the start region
     *
     * @internal
     */
    @observable
    public virtualizedIndexOffset: number = 3;

    /**
     *
     *
     * @internal
     */
    @observable
    public visibleItems: any[] = [];

    /**
     *
     *
     * @internal
     */
    @observable
    public totalStackSpan: number = 0;

    /**
     *
     *
     * @internal
     */
    @observable
    public startSpacerSpan: number = 0;

    /**
     *
     *
     * @internal
     */
    @observable
    public endSpacerSpan: number = 0;

    /**
     *
     *
     * @internal
     */
    @observable
    public gridTemplateSpans: string;

    /**
     *
     *
     * @internal
     */
    @observable
    public firstRenderedIndex: number = -1;

    /**
     *
     *
     * @internal
     */
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

    private itemsRepeatBehavior: RepeatBehavior | null;
    private itemsPlaceholder: Node;

    /**
     * Delays updating ui during scrolling
     * (to avoid rendering of items that just scroll by)
     */
    private scrollLayoutUpdateTimer: number | null = null;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.viewportElement = this.getViewport();
        if (this.autoUpdateMode === "auto") {
            this.startAutoUpdateEventListeners();
        }

        this.initializeResizeDetector();

        this.itemsPlaceholder = document.createComment("");
        this.appendChild(this.itemsPlaceholder);
    }

    public getI;

    private initializeRepeatBehavior(): void {
        this.pendingReset = false;

        if (this.itemsRepeatBehavior !== null) {
            this.$fastController.removeBehaviors([this.itemsRepeatBehavior]);
            this.itemsRepeatBehavior = null;
        }

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.visibleItems,
            x => x.itemTemplate,
            { positioning: true }
        ).createBehavior(this.itemsPlaceholder);
        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);

        this.startObservers();
        this.updateDimensions();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        if (this.autoUpdateMode === "auto") {
            this.stopAutoUpdateEventListeners();
        }
        this.stopObservers();
        this.disconnectResizeDetector();
        super.disconnectedCallback();
        this.clearLayoutUpdateTimer();
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
     * the position in the stack (in pixels) of the top of a particular item
     *
     * @public
     */
    public getItemPosition(itemIndex: number): number {
        if (itemIndex < 0 || itemIndex >= this.items.length) {
            // out of range
            return 0;
        }

        let returnVal = 0;

        if (this.spanMap !== undefined) {
            // todo
            returnVal = 0;
        } else {
            returnVal = this.startRegionSpan + itemIndex * this.itemSpan;
        }

        return returnVal;
    }

    /**
     *
     */
    protected reset(): void {
        if (this.pendingReset) {
            return;
        }

        this.pendingReset = true;

        DOM.queueUpdate(() => {
            this.initializeRepeatBehavior();
        });
    }

    /**
     * initializes the instance's resize observer
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector();
        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.requestPositionUpdates
        );
    }

    /**
     * destroys the instance's resize observer
     */
    private disconnectResizeDetector(): void {
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }

    private startLayoutUpdateTimer(): void {
        this.clearLayoutUpdateTimer();
        this.scrollLayoutUpdateTimer = window.setTimeout((): void => {
            this.clearLayoutUpdateTimer();
            this.updateVisibleItems();
        }, this.layoutUpdateDelay);
    }

    private clearLayoutUpdateTimer(): void {
        if (this.scrollLayoutUpdateTimer !== null) {
            window.clearTimeout(this.scrollLayoutUpdateTimer);
            this.scrollLayoutUpdateTimer = null;
        }
    }

    /**
     * starts event listeners that can trigger auto updating
     */
    private startAutoUpdateEventListeners = (): void => {
        window.addEventListener(eventResize, this.handleResizeEvent, {
            passive: true,
        });
        window.addEventListener(eventScroll, this.handleScrollEvent, {
            passive: true,
            capture: true,
        });
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.observe(this.viewportElement);
        }
    };

    /**
     *
     */
    private handleScrollEvent = (e: Event): void => {
        this.requestPositionUpdates();
    };

    /**
     *
     */
    private handleResizeEvent = (e: Event): void => {
        this.requestPositionUpdates();
    };

    /**
     * stops event listeners that can trigger auto updating
     */
    private stopAutoUpdateEventListeners = (): void => {
        window.removeEventListener(eventResize, this.requestPositionUpdates);
        window.removeEventListener(eventScroll, this.requestPositionUpdates);
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.unobserve(this.viewportElement);
        }
    };

    /**
     * Gets the viewport element by id, or defaults to document root
     */
    private getViewport = (): HTMLElement => {
        let viewportElement: HTMLElement | null = null;
        if (typeof this.viewport === "string") {
            viewportElement = document.getElementById(this.viewport);
        }

        if (viewportElement !== null) {
            return viewportElement;
        }

        return this;
    };

    /**
     * starts observers
     */
    private startObservers = (): void => {
        this.stopObservers();

        if (this.resizeDetector !== null) {
            this.resizeDetector.observe(this);
        }
    };

    /**
     * stops observers
     */
    private stopObservers = (): void => {
        if (this.pendingPositioningUpdate) {
            this.pendingPositioningUpdate = false;
            VirtualizingStackBase.intersectionService.cancelRequestPosition(
                this.containerElement,
                this.handleIntersection
            );
            if (this.viewportElement !== null) {
                VirtualizingStackBase.intersectionService.cancelRequestPosition(
                    this.viewportElement,
                    this.handleIntersection
                );
            }
        }
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
        }
    };

    /**
     *
     */
    private updateDimensions = (): void => {
        if (this.items === undefined) {
            this.totalStackSpan = 0;
        } else {
            if (this.spanMap !== undefined) {
                if (this.spanMap.length === 0) {
                    //TODO: wire this up
                    this.totalStackSpan = 0;
                }
            } else if (this.itemSpan !== undefined) {
                this.totalStackSpan = this.itemSpan * this.items.length;
            }
        }

        this.totalStackSpan =
            this.totalStackSpan + this.startRegionSpan + this.endRegionSpan;

        this.requestPositionUpdates();
    };

    /**
     *
     */
    private updateVisibleItems = (): void => {
        if (this.pendingPositioningUpdate) {
            return;
        }

        if (
            this.items === undefined ||
            this.items.length === 0 ||
            this.containerRect === undefined ||
            this.viewportRect === undefined
        ) {
            this.visibleItems = [];
            this.startSpacerSpan = 0;
            this.endSpacerSpan = 0;
            this.visibleRangeStart = -1;
            this.visibleRangeEnd = -1;
            return;
        }

        let viewportStart: number = this.viewportRect.top;
        let viewportEnd: number = this.viewportRect.bottom;
        let containerStart: number = this.containerRect.top + this.startRegionSpan;
        let containerEnd: number = this.containerRect.bottom - this.endRegionSpan;
        let containerSpan: number = this.containerRect.height;

        if (this.orientation === Orientation.horizontal) {
            viewportStart = this.viewportRect.left;
            viewportEnd = this.viewportRect.right;
            containerStart = this.containerRect.left + this.startRegionSpan;
            containerEnd = this.containerRect.right - this.endRegionSpan;
            containerSpan = this.containerRect.width;
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

        if (this.spanMap !== undefined) {
            // TODO: scomea - wire this up
            this.visibleItems = [];
            this.startSpacerSpan = 0;
            this.endSpacerSpan = 0;
        } else if (this.itemSpan !== undefined) {
            let newFirstRenderedIndex: number = Math.floor(
                this.visibleRangeStart / this.itemSpan
            );
            const visibleRangeLength = this.visibleRangeEnd - this.visibleRangeStart;
            let newLastRenderedIndex: number =
                newFirstRenderedIndex + Math.ceil(visibleRangeLength / this.itemSpan);

            if (newFirstRenderedIndex < 0) {
                newFirstRenderedIndex = 0;
            }

            if (newLastRenderedIndex >= this.items.length) {
                newLastRenderedIndex = this.items.length - 1;
            }

            this.startSpacerSpan = newFirstRenderedIndex * this.itemSpan;
            this.endSpacerSpan =
                (this.items.length - newLastRenderedIndex - 1) * this.itemSpan;

            if (
                this.firstRenderedIndex === -1 ||
                this.visibleItems.length === 0 ||
                newFirstRenderedIndex > this.lastRenderedIndex ||
                newLastRenderedIndex < this.firstRenderedIndex
            ) {
                // full reset
                this.visibleItems.splice(0);
                this.visibleItems = this.items.slice(
                    newFirstRenderedIndex,
                    newLastRenderedIndex + 1
                );
                this.firstRenderedIndex = newFirstRenderedIndex;
                this.lastRenderedIndex = newLastRenderedIndex;
                this.updateGridTemplateSpans();
                return;
            }

            let visibleItemIndex: number = this.visibleItems.length - 1;

            for (
                let i: number = this.lastRenderedIndex;
                i >= this.firstRenderedIndex;
                i--
            ) {
                if (i < newFirstRenderedIndex || i > newLastRenderedIndex) {
                    this.visibleItems.splice(visibleItemIndex, 1);
                }
                visibleItemIndex--;
            }

            if (newFirstRenderedIndex < this.firstRenderedIndex) {
                for (
                    let i: number = this.firstRenderedIndex - 1;
                    i >= newFirstRenderedIndex;
                    i--
                ) {
                    this.visibleItems.splice(0, 0, this.items[i]);
                }
            }

            if (newLastRenderedIndex > this.lastRenderedIndex) {
                for (
                    let i: number = this.lastRenderedIndex + 1;
                    i <= newLastRenderedIndex;
                    i++
                ) {
                    this.visibleItems.push(this.items[i]);
                }
            }

            this.firstRenderedIndex = newFirstRenderedIndex;
            this.lastRenderedIndex = newLastRenderedIndex;

            this.updateGridTemplateSpans();
        }
    };

    private updateGridTemplateSpans(): void {
        this.gridTemplateSpans = `[start]${this.startRegionSpan}px ${this.startSpacerSpan}px repeat(${this.visibleItems.length}, ${this.itemSpan}px) ${this.endSpacerSpan}px [end]${this.endRegionSpan}px`;
    }

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (this.pendingPositioningUpdate) {
            return;
        }
        this.pendingPositioningUpdate = true;
        this.clearLayoutUpdateTimer();

        DOM.queueUpdate(() => {
            VirtualizingStackBase.intersectionService.requestPosition(
                this.containerElement,
                this.handleIntersection
            );
            VirtualizingStackBase.intersectionService.requestPosition(
                this.viewportElement,
                this.handleIntersection
            );
        });
    };

    /**
     *  Handle intersections
     */
    private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        if (!this.pendingPositioningUpdate) {
            return;
        }

        this.pendingPositioningUpdate = false;

        const containerEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.containerElement
        );
        const viewportEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.viewportElement
        );

        if (containerEntry === undefined || viewportEntry === undefined) {
            return;
        }

        this.containerRect = containerEntry.boundingClientRect;
        if (this.viewportElement === document.documentElement) {
            this.viewportRect = new DOMRectReadOnly(
                viewportEntry.boundingClientRect.x + document.documentElement.scrollLeft,
                viewportEntry.boundingClientRect.y + document.documentElement.scrollTop,
                viewportEntry.boundingClientRect.width,
                viewportEntry.boundingClientRect.height
            );
        } else {
            this.viewportRect = viewportEntry.boundingClientRect;
        }

        if (this.layoutUpdateDelay > 0) {
            this.startLayoutUpdateTimer();
            return;
        }
        this.updateVisibleItems();
    };
}
