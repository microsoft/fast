import { attr, DOM, FASTElement } from "@microsoft/fast-element";
// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861
import {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "../anchored-region/resize-observer";
import { ResizeObserverEntry } from "../anchored-region/resize-observer-entry";

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }
}

/**
 * The views types for a horizontal-scroll {@link @microsoft/fast-foundation#(HorizontalScroll:class)}
 * @public
 */
export type HorizontalScrollView = "default" | "mobile";

/**
 * The easing types available for the horizontal-scroll {@link @microsoft/fast-foundation#(HorizontalScroll:class)}
 * @public
 */
export type ScrollEasing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

/**
 * A HorizontalScroll Custom HTML Element
 * @public
 */
export class HorizontalScroll extends FASTElement {
    /**
     * Reference to DOM element that scrolls the content
     * @public
     */
    public scrollContainer: HTMLDivElement;

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
     * Speed of scroll in pixels per second
     * @public
     */
    @attr
    public speed: number = 600;

    /**
     * Attribute used for easing, defaults to ease-in-out
     * @public
     */
    @attr
    public easing: ScrollEasing = "ease-in-out";

    /**
     * Detects if the component has been resized
     * @internal
     */
    private resizeDetector: ResizeObserverClassDefinition | null = null;

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

    @attr
    private isRtl: boolean = false;

    /**
     * View: default | mobile
     * @public
     */
    @attr({
        attribute: "view",
    })
    public view: HorizontalScrollView;

    /**
     * @public
     */
    public connectedCallback(): void {
        super.connectedCallback();

        DOM.queueUpdate(this.setStops.bind(this));
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
        this.resizeDetector?.observe(this);
    };

    /**
     * Stops observers
     * @internal
     */
    private stopObservers = (): void => {
        this.resizeDetector?.disconnect();
    };

    /**
     * destroys the instance's resize observer
     * @internal
     */
    private disconnectResizeDetector(): void {
        this.stopObservers();
        this.resizeDetector = null;
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
            if (entry.target === this) this.resized();
        });
    };

    /**
     * Finds all of the scroll stops between elements
     * @internal
     */
    private setStops(): void {
        this.width = this.offsetWidth;
        let lastStop: number = 0;
        const scrollItems: Array<any> = [].slice
            .call(this.children)
            /* filter out non-default slots */
            .filter(
                (el: Element): boolean =>
                    !el.getAttribute("slot") || el.getAttribute("slot") === "default"
            );

        /* RTL items will come in reverse offsetLeft */
        const isRtl: boolean =
            scrollItems.length > 1 &&
            scrollItems[0].offsetLeft > scrollItems[1].offsetLeft;
        this.isRtl = isRtl;

        const stops: Array<number> = scrollItems.map(
            (
                { offsetLeft: left, offsetWidth: width }: any,
                idx: number,
                ary: Array<any>
            ): number => {
                const firstLtr: boolean = !isRtl && idx === 0;
                const lastRtl: boolean = isRtl && idx === ary.length - 1;
                const right: number = (left + width) * (isRtl ? -1 : 1);

                /* Getting the final stop after the last item or before the first RTL item */
                if (!isRtl || idx === 0) {
                    lastStop = right;
                }

                /* Remove extra margin on first item and last RTL item */
                if (lastRtl || firstLtr) {
                    left = 0;
                } else if (isRtl) {
                    left = right;
                }

                return left;
            }
        );

        stops.push(lastStop);

        /* Sort to zero */
        stops.sort((a, b) => Math.abs(a) - Math.abs(b));

        this.scrollStops = stops;
        this.setFlippers();
    }

    /**
     * Returns the current scroll position of the scrollContainer
     * @internal
     */
    private getScrollPosition(): number {
        return this.scrollContainer.scrollLeft;
    }

    /**
     * Sets the controls view if enabled
     * @internal
     */
    private setFlippers(): void {
        const position: number = this.getScrollPosition();
        if (this.previousFlipper) {
            this.previousFlipper.classList.toggle("disabled", position === 0);
        }
        if (this.nextFlipper) {
            const lastStop: number = this.scrollStops[this.scrollStops.length - 1];
            this.nextFlipper.classList.toggle(
                "disabled",
                this.isRtl
                    ? position - this.width <= lastStop
                    : position + this.width >= lastStop
            );
        }
    }

    /**
     * Scrolls items to the left
     * @public
     */
    public scrollToPrevious(): void {
        const position: number = this.getScrollPosition();
        const stops: Array<number> = this.scrollStops;
        if (this.isRtl) stops.sort((a: number, b: number): number => b - a);
        const current: number = stops.findIndex(
            (stop: number, idx: number, ary: Array<number>): boolean =>
                this.isRtl
                    ? stop <= position
                    : stop <= position &&
                      (idx === ary.length - 1 || ary[idx + 1] > position)
        );
        const right: number = stops[current + 1];
        const nextIndex: number =
            stops.findIndex((stop: number): boolean =>
                this.isRtl ? stop - this.width < right : stop + this.width > right
            ) || 0;
        const left: number = this.scrollStops[
            nextIndex < current ? nextIndex : current > 0 ? current - 1 : 0
        ];
        this.scrollToPosition(left, position);
    }

    /**
     * Scrolls items to the right
     * @public
     */
    public scrollToNext(): void {
        const position: number = this.getScrollPosition();
        const current: number = this.scrollStops.findIndex(
            (stop: number): boolean => stop === position
        );
        const outOfView: number = this.scrollStops.findIndex((stop: number): boolean =>
            this.isRtl ? stop <= position - this.width : stop >= position + this.width
        );
        let nextIndex: number = current;
        if (outOfView > current + 2) {
            nextIndex = outOfView - 2;
        } else if (current < this.scrollStops.length - 2) {
            nextIndex = current + 1;
        }
        const nextStop: number = this.scrollStops[nextIndex];
        this.scrollToPosition(nextStop, position);
    }

    /**
     * Handles scrolling with easing
     * @param position - starting position
     * @param newPosition - position to scroll to
     */
    private scrollToPosition(
        newPosition: number,
        position: number = this.scrollContainer.scrollLeft
    ): void {
        const getEasedTime = (ease: ScrollEasing, k: number): number => {
            if (k > 1) k = 1;
            switch (ease) {
                case "ease-in":
                    return Math.pow(k, 1.675);
                case "ease-out":
                    return 1 - Math.pow(1 - k, 1.675);
                case "ease-in-out":
                    return 0.5 * (Math.sin((k - 0.5) * Math.PI) + 1);
                default:
                    return k;
            }
        };
        const fps: number = 120;
        const dir: number = position < newPosition ? 1 : -1;
        const distance: number = Math.abs(newPosition - position);
        const seconds: number = distance / this.speed;
        const steps: number = fps * seconds;
        const move = (step: number, time: number): void => {
            const progress: number = step / steps;
            const eased: number = getEasedTime(this.easing, progress);
            const nextStop: number = position + distance * eased * dir;
            if (step < steps) {
                this.scrollContainer.scrollLeft = nextStop;
                setTimeout(() => move(step + 1, time), time);
            } else {
                this.scrollContainer.scrollLeft = newPosition;
                this.setFlippers();
            }
        };
        move(0, 1000 / fps);
    }
    /**
     * Monitors resize event on the horizontal-scroll element
     * @public
     */
    public resized(): void {
        this.width = this.offsetWidth;
        this.setFlippers();
    }

    /**
     * Monitors scrolled event on the content container
     * @public
     */
    public scrolled(): void {
        this.setFlippers();
    }

    /**
     * Move the index back to the zero position
     * @public
     */
    public moveToStart(): void {
        this.scrollToPosition(0);
    }
}
