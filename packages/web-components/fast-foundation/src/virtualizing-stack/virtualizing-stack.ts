import { attr, DOM, observable, ViewTemplate } from "@microsoft/fast-element";
import { Direction, eventResize, eventScroll } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
import { IntersectionService } from "../anchored-region/intersection-service";
import type { ResizeObserverEntry } from "../anchored-region/resize-observer-entry";
import type {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "../anchored-region/resize-observer";

/**
 * Defines if the component updates its position automatically. Calling update() always provokes an update.
 *
 * @beta
 */
export type VirtualizingStackAutoUpdateMode = "resize-only" | "auto";

/**
 * An virtualizing stack Custom HTML Element.
 *
 * @public
 */
export class VirtualizingStack extends FoundationElement {
    /**
     * The HTML ID of the viewport element this region is positioned relative to
     *
     * @beta
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public viewport: string = "";
    private viewportChanged(): void {
        if (this.initialLayoutComplete) {
            this.viewportElement = this.getViewport();
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
    public autoUpdateMode: VirtualizingStackAutoUpdateMode = "resize-only";
    private autoUpdateModeChanged(
        prevMode: VirtualizingStackAutoUpdateMode,
        newMode: VirtualizingStackAutoUpdateMode
    ): void {
        if (
            (this as FoundationElement).$fastController.isConnected &&
            this.initialLayoutComplete
        ) {
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
    public viewportElement: HTMLElement | null = null;
    private viewportElementChanged(): void {
        if (
            (this as FoundationElement).$fastController.isConnected &&
            this.initialLayoutComplete
        ) {
            this.initialize();
        }
    }

    /**
     *
     *
     * @public
     */
    @observable
    public items: any[];

    /**
     * The default row item template.  Set by the component templates.
     *
     * @internal
     */
    @observable
    public itemTemplate: ViewTemplate;

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
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    @observable
    public initialLayoutComplete: boolean = false;

    private static intersectionService: IntersectionService = new IntersectionService();
    private resizeDetector: ResizeObserverClassDefinition | null = null;
    private pendingPositioningUpdate: boolean = false;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.autoUpdateMode === "auto") {
            this.startAutoUpdateEventListeners();
        }
        this.initialize();
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
     * update position
     */
    public update = (): void => {
        // if (!this.pendingPositioningUpdate) {
        //     this.requestPositionUpdates();
        // }
    };

    /**
     *  Handle resize events
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        this.update();
    };

    /**
     * fully initializes the component
     */
    private initialize(): void {
        this.initializeResizeDetector();
    }

    /**
     * starts event listeners that can trigger auto updating
     */
    private startAutoUpdateEventListeners = (): void => {
        window.addEventListener(eventResize, this.update, { passive: true });
        window.addEventListener(eventScroll, this.update, {
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
        window.removeEventListener(eventResize, this.update);
        window.removeEventListener(eventScroll, this.update);
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.unobserve(this.viewportElement);
        }
    };

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
     * initializes the instance's resize observer
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector();
        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleResize
        );
    }

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (this.pendingPositioningUpdate) {
            return;
        }
        VirtualizingStack.intersectionService.requestPosition(
            this,
            this.handleIntersection
        );
        if (this.viewportElement !== null) {
            VirtualizingStack.intersectionService.requestPosition(
                this.viewportElement,
                this.handleIntersection
            );
        }
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

        // if (!this.applyIntersectionEntries(entries)) {
        //     return;
        // }

        // this.updateLayout();
    };

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
}
