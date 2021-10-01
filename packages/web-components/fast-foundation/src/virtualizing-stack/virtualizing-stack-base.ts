import {
    attr,
    DOM,
    html,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import { eventResize, eventScroll } from "@microsoft/fast-web-utilities";
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
    <template>
        <div
            style="
            height:20px;
            grid-template-row:${(x, c) => c.index + 1}
        "
        >
            ${x => x}
        </div>
    </template>
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
     * HTML Attribute: item-height
     */
    @attr({ attribute: "item-height" })
    public itemHeight: number;
    private itemHeightChanged(): void {
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
    @attr({ attribute: "layout-update-delay" })
    public layoutUpdateDelay: number = 0;

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
    public heightMap: number[];
    private heightMapChanged(): void {
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
    public totalHeight: number = 0;

    /**
     *
     *
     * @internal
     */
    @observable
    public topSpacerHeight: number = 0;

    /**
     *
     *
     * @internal
     */
    @observable
    public bottomSpacerHeight: number = 0;

    /**
     *
     *
     * @internal
     */
    @observable
    public itemStackHeight: number = 0;

    /**
     * reference to the container element
     *
     * @internal
     */
    public containerElement: HTMLDivElement;

    /**
     * reference to the container element
     *
     * @internal
     */
    public stackElement: HTMLDivElement;

    private static intersectionService: IntersectionService = new IntersectionService();
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    private pendingPositioningUpdate: boolean = false;

    private pendingReset: boolean = false;

    private visibleRangeStart: number = 0;
    private visibleRangeEnd: number = 0;

    private firstRenderedIndex: number = -1;
    private lastRenderedIndex: number = -1;

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

    private initializeRepeatBehavior(): void {
        this.pendingReset = false;

        if (this.itemsRepeatBehavior !== null) {
            // TODO: cleanup
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
        if (this.layoutUpdateDelay < 1) {
            this.updateVisibleItems();
            return;
        }
        this.clearLayoutUpdateTimer();
        this.scrollLayoutUpdateTimer = window.setTimeout((): void => {
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
        window.addEventListener(eventResize, this.requestPositionUpdates, {
            passive: true,
        });
        window.addEventListener(eventScroll, this.requestPositionUpdates, {
            passive: true,
            capture: true,
        });
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.observe(this.viewportElement);
        }
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

        return document.documentElement;
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
        console.debug("updateDimensions");
        if (this.items === undefined) {
            this.totalHeight = 0;
        } else {
            if (this.heightMap !== undefined) {
                if (this.heightMap.length === 0) {
                    //TODO: wire this up
                    this.totalHeight = 0;
                }
            } else if (this.itemHeight !== undefined) {
                this.totalHeight = this.itemHeight * this.items.length;
            }
        }

        this.requestPositionUpdates();
    };

    /**
     *
     */
    private updateVisibleItems = (): void => {
        this.clearLayoutUpdateTimer();

        if (this.pendingPositioningUpdate) {
            console.debug("updateVisibleItems - return");
            return;
        }

        console.debug("updateVisibleItems");

        if (
            this.items === undefined ||
            this.items.length === 0 ||
            this.containerRect === undefined ||
            this.viewportRect === undefined
        ) {
            this.visibleItems = [];
            this.topSpacerHeight = 0;
            this.bottomSpacerHeight = 0;
            this.itemStackHeight = 0;
            this.visibleRangeStart = -1;
            this.visibleRangeEnd = -1;
            return;
        }

        if (this.viewportRect.top >= this.containerRect.bottom) {
            this.visibleRangeStart = this.containerRect.height;
            this.visibleRangeEnd = this.containerRect.height;
        } else if (this.viewportRect.bottom <= this.containerRect.top) {
            this.visibleRangeStart = 0;
            this.visibleRangeEnd = 0;
        } else {
            this.visibleRangeStart =
                this.viewportRect.top - this.containerRect.top - this.viewportBuffer;
            this.visibleRangeEnd =
                this.containerRect.height -
                (this.containerRect.bottom -
                    (this.viewportRect.bottom + this.viewportBuffer));

            this.visibleRangeStart =
                this.visibleRangeStart < 0 ? 0 : this.visibleRangeStart;
            this.visibleRangeEnd =
                this.visibleRangeEnd > this.containerRect.height
                    ? this.containerRect.height
                    : this.visibleRangeEnd;
        }

        if (this.heightMap !== undefined) {
            // TODO: scomea - wire this up
            this.visibleItems = [];
            this.topSpacerHeight = 0;
            this.bottomSpacerHeight = 0;
            this.itemStackHeight = 0;
        } else if (this.itemHeight !== undefined) {
            let newFirstRenderedIndex: number = Math.floor(
                this.visibleRangeStart / this.itemHeight
            );
            const visibleRangeLength = this.visibleRangeEnd - this.visibleRangeStart;
            let newLastRenderedIndex: number =
                newFirstRenderedIndex + Math.ceil(visibleRangeLength / this.itemHeight);

            if (newFirstRenderedIndex < 0) {
                newFirstRenderedIndex = 0;
            }

            if (newLastRenderedIndex >= this.items.length) {
                newLastRenderedIndex = this.items.length - 1;
            }

            this.topSpacerHeight = newFirstRenderedIndex * this.itemHeight;
            this.bottomSpacerHeight =
                (this.items.length - newLastRenderedIndex - 1) * this.itemHeight;
            this.itemStackHeight =
                this.totalHeight - this.topSpacerHeight - this.bottomSpacerHeight;

            if (
                this.firstRenderedIndex === newFirstRenderedIndex &&
                this.lastRenderedIndex === newLastRenderedIndex
            ) {
                return;
            }

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
        }
    };

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (this.pendingPositioningUpdate) {
            return;
        }
        console.debug("requestPositionUpdates");
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

        console.debug(`handleIntersection: ${this.containerRect?.top}`);

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

        this.startLayoutUpdateTimer();
    };
}
