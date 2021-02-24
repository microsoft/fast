import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861
import {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "../anchored-region/resize-observer";
import { ResizeObserverEntry } from "../anchored-region/resize-observer-entry";
import { ScrollerControlStyles } from "./scroller.styles";

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }
}

/**
 * The views types for a scroller {@link @microsoft/fast-foundation#(Scroller:class)}
 * @public
 */
export type ScrollerView = "default" | "mobile";

/**
 * A Scroller Custom HTML Element
 * @public
 */
export class Scroller extends FASTElement {
    /**
     * Reference to DOM element containing the content to scroll
     * @public
     */
    public content: HTMLDivElement;

    /**
     * Reference to flipper to scroll to previous content
     * @public
     */
    public previousFlipper: HTMLDivElement;

    /**
     * Reference to flipper to scroll to the next content
     * @public
     */
    public nextFlipper: HTMLDivElement;

    /**
     * Detects if the component has been resized
     * @internal
     */
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    /**
     * Current scroll position
     * @internal
     */
    @attr
    private position: number;

    /**
     * Width of the parent container
     * @internal
     */
    @attr
    private width: number;

    /**
     * Scroll stop positions between elements
     * @internal
     */
    @attr
    private scrollStops: Array<number>;

    /**
     * View: default | mobile
     * @public
     */
    @attr({
        attribute: "view",
    })
    public view: ScrollerView;

    /**
     * @public
     */
    public connectedCallback(): void {
        super.connectedCallback();
        if (this.view !== "mobile") {
            this.$fastController.addStyles(ScrollerControlStyles);
        }

        DOM.queueUpdate(this.moveToStart.bind(this));
        this.initializeResizeDetector();
        this.startObservers();
    }

    /**
     * @public
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.disconnectResizeDetector();
    }

    /**
     * Starts observers
     * @internal
     */
    private startObservers = (): void => {
        this.stopObservers();

        if (this.resizeDetector !== null) {
            this.resizeDetector.observe(this);
        }
    };

    /**
     * Stops observers
     * @internal
     */
    private stopObservers = (): void => {
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
        }
    };

    /**
     * destroys the instance's resize observer
     * @internal
     */
    private disconnectResizeDetector(): void {
        this.stopObservers();

        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }

    /**
     * initializes the instance's resize observer
     * @internal
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector();
        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleResize.bind(this)
        );
    }

    /**
     * Handle resize events
     * @internal
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        entries.forEach((entry: ResizeObserverEntry) => {
            if (entry.target === this) {
                this.moveToStart();
            }
        });
    };

    /**
     * Finds all of the scroll stops between elements
     * @internal
     */
    private setStops(): void {
        let lastStop: number = 0;
        this.scrollStops = [].slice
            .call(this.children)
            .filter(
                (el: Element): boolean =>
                    !el.getAttribute("slot") || el.getAttribute("slot") === "default"
            )
            .map((el: any, idx: number): number => {
                lastStop = el.offsetLeft + el.offsetWidth;
                return idx === 0 ? 0 : el.offsetLeft;
            });

        this.scrollStops.push(lastStop);
    }

    /**
     * Sets the controls view if enabled
     * @internal
     */
    private setFlippers(): void {
        if (this.previousFlipper && this.nextFlipper) {
            this.previousFlipper.classList.toggle("disabled", this.position <= 0);
            const lastStop: number = this.scrollStops[this.scrollStops.length - 1];
            this.nextFlipper.classList.toggle(
                "disabled",
                this.position + this.width >= lastStop
            );
        }
    }

    /**
     * Scrolls items to the left
     * @public
     */
    public scrollToPrevious(): void {
        const right: number = this.scrollStops[
            this.scrollStops.findIndex((stop: number) => stop === this.position) + 1
        ];
        const left: number =
            this.scrollStops.find((stop: number): boolean => stop + this.width > right) ||
            0;
        this.content.style.transform = `translate3d(-${left}px, 0, 0)`;
        this.position = left;
        this.setFlippers();
    }

    /**
     * Scrolls items to the right
     * @public
     */
    public scrollToNext(): void {
        const outOfView: number = this.scrollStops.findIndex(
            (stop: number): boolean => stop >= this.position + this.width
        );
        const nextStop: number = this.scrollStops[outOfView > 1 ? outOfView - 2 : 0];
        this.content.style.transform = `translate3d(-${nextStop}px, 0, 0)`;
        this.position = nextStop;
        this.setFlippers();
    }

    /**
     * Move the index back to the zero position
     * @public
     */
    public moveToStart(): void {
        this.position = 0;
        this.content.style.transform = "translate3d(0, 0, 0)";
        this.width = this.offsetWidth;
        this.setStops();
        this.setFlippers();
    }
}
