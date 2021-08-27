import {
    attr,
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
export type VirtualizingStackAutoUpdateMode = "manual | resize-only" | "auto";

const defaultItemTemplate: ViewTemplate<any> = html`
    <template>
        <div style="height:20px;">
            ${x => x}
        </div>
    </template>
`;

/**
 * An virtualizing stack Custom HTML Element.
 *
 * @public
 */
export class VirtualizingStack extends FoundationElement {
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
            this.updateVisibleItems();
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
     * The HTML element being used as the viewport
     *
     * @beta
     */
    @observable
    public viewportElement: HTMLElement | null;
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
    public items: any[];
    private itemsChanged(): void {
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
    public heightMap: number[];
    private itemEndsChanged(): void {
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

    private static intersectionService: IntersectionService = new IntersectionService();
    private resizeDetector: ResizeObserverClassDefinition | null = null;
    private pendingPositioningUpdate: boolean = false;

    private visibleRangeStart: number = 0;
    private visibleRangeEnd: number = 0;

    private viewportRect: ClientRect | DOMRect | undefined;
    private stackRect: ClientRect | DOMRect | undefined;

    private itemsRepeatBehavior: RepeatBehavior | null;
    private itemsPlaceholder: Node | null = null;

    // defines how big a difference in pixels there must be between states to
    // justify a layout update that affects the dom (prevents repeated sub-pixel corrections)
    private updateThreshold: number = 0.5;

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
        this.startObservers();
        this.updateDimensions();
        this.requestPositionUpdates();

        this.itemsPlaceholder = document.createComment("");
        this.appendChild(this.itemsPlaceholder);

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.visibleItems,
            x => x.itemTemplate,
            { positioning: true }
        ).createBehavior(this.itemsPlaceholder);

        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.autoUpdateMode === "auto") {
            this.stopAutoUpdateEventListeners();
        }
        this.stopObservers();
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

    /**
     * Gets the viewport element by id, or defaults to document root
     */
    private getViewport = (): HTMLElement | null => {
        if (typeof this.viewport !== "string" || this.viewport === "") {
            return document.documentElement;
        }

        return document.getElementById(this.viewport);
    };

    /**
     * starts observers
     */
    private startObservers = (): void => {
        this.stopObservers();

        this.requestPositionUpdates();

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
            VirtualizingStack.intersectionService.cancelRequestPosition(
                this,
                this.handleIntersection
            );
            if (this.viewportElement !== null) {
                VirtualizingStack.intersectionService.cancelRequestPosition(
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
        if (
            this.items === undefined ||
            this.items.length === 0 ||
            this.stackRect === undefined ||
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

        if (this.viewportRect.top >= this.stackRect.bottom) {
            this.visibleRangeStart = this.stackRect.height;
            this.visibleRangeEnd = this.stackRect.height;
        } else if (this.viewportRect.bottom <= this.stackRect.top) {
            this.visibleRangeStart = 0;
            this.visibleRangeEnd = 0;
        } else {
            this.visibleRangeStart = this.viewportRect.top - this.stackRect.top;
            this.visibleRangeEnd =
                this.stackRect.height -
                (this.stackRect.bottom - this.viewportRect.bottom);

            this.visibleRangeStart =
                this.visibleRangeStart < 0 ? 0 : this.visibleRangeStart;
            this.visibleRangeEnd =
                this.visibleRangeEnd > this.stackRect.height
                    ? this.stackRect.height
                    : this.visibleRangeEnd;
        }

        if (this.heightMap !== undefined) {
            // TODO: scomea - wire this up
            this.visibleItems = [];
            this.topSpacerHeight = 0;
            this.bottomSpacerHeight = 0;
            this.itemStackHeight = 0;
        } else if (this.itemHeight !== undefined) {
            let firstVisibleIndex: number = Math.floor(
                this.visibleRangeStart / this.itemHeight
            );
            const visibleRangeLength = this.visibleRangeEnd - this.visibleRangeStart;
            let lastVisibleIndex: number =
                firstVisibleIndex + Math.ceil(visibleRangeLength / this.itemHeight);

            if (firstVisibleIndex < 0) {
                firstVisibleIndex = 0;
            }

            if (lastVisibleIndex >= this.items.length) {
                lastVisibleIndex = this.items.length - 1;
            }

            this.visibleItems = this.items.slice(firstVisibleIndex, lastVisibleIndex + 1);
            this.topSpacerHeight = firstVisibleIndex * this.itemHeight;
            this.bottomSpacerHeight =
                (this.items.length - lastVisibleIndex - 1) * this.itemHeight;
            this.itemStackHeight =
                this.totalHeight - this.topSpacerHeight - this.bottomSpacerHeight;
        }
    };

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (this.pendingPositioningUpdate || this.viewportElement === null) {
            return;
        }
        VirtualizingStack.intersectionService.requestPosition(
            this,
            this.handleIntersection
        );
        VirtualizingStack.intersectionService.requestPosition(
            this.viewportElement,
            this.handleIntersection
        );
        this.pendingPositioningUpdate = true;
    };

    /**
     *  Handle intersections
     */
    private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        if (!this.pendingPositioningUpdate) {
            return;
        }

        this.pendingPositioningUpdate = false;

        const stackEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this
        );
        const viewportEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.viewportElement
        );

        if (stackEntry === undefined || viewportEntry === undefined) {
            return;
        }

        if (
            this.viewportRect === undefined ||
            this.stackRect === undefined ||
            this.isRectDifferent(this.stackRect, stackEntry.boundingClientRect) ||
            this.isRectDifferent(this.viewportRect, viewportEntry.boundingClientRect)
        ) {
            this.stackRect = stackEntry.boundingClientRect;
            if (this.viewportElement === document.documentElement) {
                this.viewportRect = new DOMRectReadOnly(
                    viewportEntry.boundingClientRect.x +
                        document.documentElement.scrollLeft,
                    viewportEntry.boundingClientRect.y +
                        document.documentElement.scrollTop,
                    viewportEntry.boundingClientRect.width,
                    viewportEntry.boundingClientRect.height
                );
            } else {
                this.viewportRect = viewportEntry.boundingClientRect;
            }

            this.updateVisibleItems();
        }
    };

    /**
     *  compare rects to see if there is enough change to justify a DOM update
     */
    private isRectDifferent = (
        rectA: DOMRect | ClientRect,
        rectB: DOMRect | ClientRect
    ): boolean => {
        if (
            Math.abs(rectA.top - rectB.top) > this.updateThreshold ||
            Math.abs(rectA.right - rectB.right) > this.updateThreshold ||
            Math.abs(rectA.bottom - rectB.bottom) > this.updateThreshold ||
            Math.abs(rectA.left - rectB.left) > this.updateThreshold
        ) {
            return true;
        }
        return false;
    };
}
