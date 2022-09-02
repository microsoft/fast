import {
    attr,
    booleanConverter,
    FASTElement,
    nullableNumberConverter,
    observable,
    Updates,
} from "@microsoft/fast-element";
import type { ResizeObserverClassDefinition } from "../utilities/resize-observer.js";
import type { HorizontalScrollView } from "./horizontal-scroll.options.js";
import { ScrollEasing } from "./horizontal-scroll.options.js";

/**
 * A HorizontalScroll Custom HTML Element
 *
 * @slot start - Content which can be provided before the scroll area
 * @slot end - Content which can be provided after the scroll area
 * @slot - Content in the scroll area
 * @slot previous-flipper - The component for scrolling previous
 * @slot next-flipper - The component for scrolling next
 * @csspart scroll-area - Wraps the entire scrollable region
 * @csspart scroll-view - The visible scroll area
 * @csspart content - The container for the content
 * @csspart scroll-previous - The previous flipper container
 * @csspart previous-flipper - The previous flipper
 * @csspart scroll-next - The next flipper container
 * @csspart next-flipper - The next flipper
 * @fires scrollstart - Fires a custom 'scrollstart' event when scrolling
 * @fires scrollend - Fires a custom 'scrollend' event when scrolling stops
 *
 * @public
 */
export class FASTHorizontalScroll extends FASTElement {
    /**
     * Reference to DOM element that scrolls the content
     * @public
     */
    public scrollContainer: HTMLDivElement;

    /**
     * Reference to DOM element that holds the slotted content
     * @public
     */
    public content: HTMLDivElement;

    /**
     * Reference to flipper to scroll to previous content
     * @public
     */
    public previousFlipperContainer: HTMLDivElement;

    /**
     * Reference to flipper to scroll to the next content
     * @public
     */
    public nextFlipperContainer: HTMLDivElement;

    /**
     * @internal
     */
    private framesPerSecond: number = 60;

    /**
     * The calculated duration for a frame.
     *
     * @internal
     */
    private get frameTime(): number {
        return 1000 / this.framesPerSecond;
    }

    /**
     * The timeout identifier for the scroll event throttling.
     *
     * @internal
     */
    private resizeTimeout?: number | void;

    /**
     * The timeout identifier for the scroll event throttling.
     *
     * @internal
     */
    private scrollTimeout?: number | void;

    /**
     * Flag indicating that the items are being updated
     *
     * @internal
     */
    private updatingItems: boolean = false;

    /**
     * Speed of scroll in pixels per second
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public speed: number = 600;

    /**
     * The CSS time value for the scroll transition duration. Overrides the `speed` attribute.
     *
     * @remarks
     * When `duration` is set, the `speed` attribute has no effect.
     *
     * @public
     */
    @attr
    public duration: string;

    /**
     * Attribute used for easing, defaults to ease-in-out
     * @public
     */
    @attr
    public easing: ScrollEasing | string = ScrollEasing.easeInOut;

    /**
     * Attribute to hide flippers from assistive technology
     * @public
     */
    @attr({ attribute: "flippers-hidden-from-at", converter: booleanConverter })
    public flippersHiddenFromAT: boolean = false;

    /**
     * Scrolling state
     * @internal
     */
    @observable
    private scrolling: boolean = false;

    /**
     * Firing scrollstart and scrollend events
     * @internal
     */
    public scrollingChanged(prev: unknown, next: boolean): void {
        if (this.scrollContainer) {
            const event = this.scrolling == true ? "scrollstart" : "scrollend";
            this.$emit(event, this.scrollContainer.scrollLeft);
        }
    }

    /**
     * Detects if the component has been resized
     * @internal
     */
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    /**
     * Width of the parent container
     * @internal
     */
    private width: number;

    /**
     * Scroll stop positions between elements
     * @internal
     */
    private scrollStops: number[];

    /**
     * The default slotted items placed in the scrolling container.
     *
     * @public
     */
    @observable
    public scrollItems: HTMLElement[];

    /**
     * In RTL mode
     * @internal
     */
    private get isRtl(): boolean {
        return (
            this.scrollItems.length > 1 &&
            this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft
        );
    }

    /**
     * View: default | mobile
     * @public
     */
    @attr({ attribute: "view" })
    public view: HorizontalScrollView;

    public connectedCallback(): void {
        super.connectedCallback();
        this.initializeResizeDetector();
    }

    public disconnectedCallback(): void {
        this.disconnectResizeDetector();
        super.disconnectedCallback();
    }

    /**
     * Updates scroll stops and flippers when scroll items change
     * @param previous - current scroll items
     * @param next - new updated scroll items
     * @public
     */
    public scrollItemsChanged(previous: HTMLElement[], next: HTMLElement[]) {
        if (next && !this.updatingItems) {
            Updates.enqueue(() => this.setStops());
        }
    }

    /**
     * destroys the instance's resize observer
     * @internal
     */
    private disconnectResizeDetector(): void {
        if (this.resizeDetector) {
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
            this.resized.bind(this)
        );
        this.resizeDetector.observe(this);
    }

    /**
     * Looks for slots and uses child nodes instead
     * @internal
     */
    private updateScrollStops(): void {
        this.updatingItems = true;
        const updatedItems: HTMLElement[] = this.scrollItems.reduce(
            (scrollItems, scrollItem) => {
                if (scrollItem instanceof HTMLSlotElement) {
                    return scrollItems.concat(
                        scrollItem.assignedElements() as HTMLElement[]
                    );
                }

                scrollItems.push(scrollItem);

                return scrollItems;
            },
            [] as HTMLElement[]
        );

        this.scrollItems = updatedItems;
        this.updatingItems = false;
    }

    /**
     * Finds all of the scroll stops between elements
     * @internal
     */
    private setStops(): void {
        this.updateScrollStops();
        const { scrollContainer: container } = this;
        const { scrollLeft } = container;
        const {
            width: containerWidth,
            left: containerLeft,
        } = container.getBoundingClientRect();
        this.width = containerWidth;
        let lastStop: number = 0;
        let stops: number[] = this.scrollItems
            .map((item, index: number): number => {
                const { left, width } = item.getBoundingClientRect();
                const leftPosition = Math.round(left + scrollLeft - containerLeft);
                const right: number = Math.round(leftPosition + width);

                if (this.isRtl) {
                    return -right;
                }

                lastStop = right;

                return index === 0 ? 0 : leftPosition;
            })
            .concat(lastStop);

        /* Fixes a FireFox bug where it doesn't scroll to the start */
        stops = this.fixScrollMisalign(stops);

        /* Sort to zero */
        stops.sort((a, b) => Math.abs(a) - Math.abs(b));

        this.scrollStops = stops;
        this.setFlippers();
    }

    /**
     * Checks to see if the stops are returning values
     *  otherwise it will try to reinitialize them
     *
     * @returns boolean indicating that current scrollStops are valid non-zero values
     * @internal
     */
    private validateStops(reinit: boolean = true): boolean {
        const hasStops: () => boolean = (): boolean =>
            !!this.scrollStops.find((stop: number) => stop > 0);
        if (!hasStops() && reinit) {
            this.setStops();
        }

        return hasStops();
    }

    /**
     *
     */
    private fixScrollMisalign(stops: number[]) {
        if (this.isRtl && stops.some(stop => stop > 0)) {
            stops.sort((a, b) => b - a);
            const offset = stops[0];
            stops = stops.map(stop => stop - offset);
        }

        return stops;
    }

    /**
     * Sets the controls view if enabled
     * @internal
     */
    private setFlippers(): void {
        const position: number = this.scrollContainer.scrollLeft;
        this.previousFlipperContainer?.classList.toggle("disabled", position === 0);

        if (this.scrollStops) {
            const lastStop: number = Math.abs(
                this.scrollStops[this.scrollStops.length - 1]
            );

            this.nextFlipperContainer?.classList.toggle(
                "disabled",
                this.validateStops(false) && Math.abs(position) + this.width >= lastStop
            );
        }
    }

    /**
     * Function that can scroll an item into view.
     * @param item - An item index, a scroll item or a child of one of the scroll items
     * @param padding - Padding of the viewport where the active item shouldn't be
     * @param rightPadding - Optional right padding. Uses the padding if not defined
     *
     * @public
     */
    public scrollInView(
        item: HTMLElement | number,
        padding: number = 0,
        rightPadding?: number
    ): void {
        if (typeof item !== "number" && item) {
            item = this.scrollItems.findIndex(
                scrollItem =>
                    scrollItem === item || scrollItem.contains(item as HTMLElement)
            );
        }
        if (item !== undefined) {
            rightPadding = rightPadding ?? padding;
            const { scrollContainer: container, scrollStops, scrollItems: items } = this;
            const { scrollLeft } = this.scrollContainer;
            const { width: containerWidth } = container.getBoundingClientRect();
            const itemStart = scrollStops[item];
            const { width } = items[item].getBoundingClientRect();
            const itemEnd = itemStart + width;

            const isBefore = scrollLeft + padding > itemStart;

            if (isBefore || scrollLeft + containerWidth - rightPadding < itemEnd) {
                const stops = [...scrollStops].sort((a, b) => (isBefore ? b - a : a - b));
                const scrollTo =
                    stops.find(position =>
                        isBefore
                            ? position + padding < itemStart
                            : position + containerWidth - (rightPadding ?? 0) > itemEnd
                    ) ?? 0;
                this.scrollToPosition(scrollTo);
            }
        }
    }

    /**
     * Lets the user arrow left and right through the horizontal scroll
     * @param e - Keyboard event
     * @public
     */
    public keyupHandler(e: Event & KeyboardEvent) {
        const key = e.key;

        switch (key) {
            case "ArrowLeft":
                this.scrollToPrevious();
                break;
            case "ArrowRight":
                this.scrollToNext();
                break;
        }
    }

    /**
     * Scrolls items to the left
     * @public
     */
    public scrollToPrevious(): void {
        this.validateStops();
        const scrollPosition = this.scrollContainer.scrollLeft;

        const current = this.scrollStops.findIndex(
            (stop, index) =>
                stop >= scrollPosition &&
                (this.isRtl ||
                    index === this.scrollStops.length - 1 ||
                    this.scrollStops[index + 1] > scrollPosition)
        );

        const right = Math.abs(this.scrollStops[current + 1]);

        let nextIndex = this.scrollStops.findIndex(
            stop => Math.abs(stop) + this.width > right
        );

        if (nextIndex >= current || nextIndex === -1) {
            nextIndex = current > 0 ? current - 1 : 0;
        }

        this.scrollToPosition(this.scrollStops[nextIndex], scrollPosition);
    }

    /**
     * Scrolls items to the right
     * @public
     */
    public scrollToNext(): void {
        this.validateStops();
        const scrollPosition = this.scrollContainer.scrollLeft;

        const current = this.scrollStops.findIndex(
            stop => Math.abs(stop) >= Math.abs(scrollPosition)
        );

        const outOfView = this.scrollStops.findIndex(
            stop => Math.abs(scrollPosition) + this.width <= Math.abs(stop)
        );

        let nextIndex = current;

        if (outOfView > current + 2) {
            nextIndex = outOfView - 2;
        } else if (current < this.scrollStops.length - 2) {
            nextIndex = current + 1;
        }

        this.scrollToPosition(this.scrollStops[nextIndex], scrollPosition);
    }

    /**
     * Handles scrolling with easing
     * @param position - starting position
     * @param newPosition - position to scroll to
     * @public
     */
    public scrollToPosition(
        newPosition: number,
        position: number = this.scrollContainer.scrollLeft
    ): void {
        if (this.scrolling) {
            return;
        }

        this.scrolling = true;

        const seconds =
            this.duration ?? `${Math.abs(newPosition - position) / this.speed}s`;

        this.content.style.setProperty("transition-duration", seconds);

        const computedDuration = parseFloat(
            getComputedStyle(this.content).getPropertyValue("transition-duration")
        );

        const transitionendHandler = (e?: TransitionEvent): void => {
            if (e && e.target !== e.currentTarget) {
                return;
            }

            this.content.style.setProperty("transition-duration", "0s");
            this.content.style.removeProperty("transform");

            this.scrollContainer.style.setProperty("scroll-behavior", "auto");
            this.scrollContainer.scrollLeft = newPosition;

            this.setFlippers();

            this.content.removeEventListener("transitionend", transitionendHandler);

            this.scrolling = false;
        };

        if (computedDuration === 0) {
            transitionendHandler();
            return;
        }

        this.content.addEventListener("transitionend", transitionendHandler);

        const maxScrollValue =
            this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;

        let transitionStop =
            this.scrollContainer.scrollLeft - Math.min(newPosition, maxScrollValue);

        if (this.isRtl) {
            transitionStop =
                this.scrollContainer.scrollLeft +
                Math.min(Math.abs(newPosition), maxScrollValue);
        }

        this.content.style.setProperty("transition-property", "transform");
        this.content.style.setProperty("transition-timing-function", this.easing);
        this.content.style.setProperty("transform", `translateX(${transitionStop}px)`);
    }

    /**
     * Monitors resize event on the horizontal-scroll element
     * @public
     */
    public resized(): void {
        if (this.resizeTimeout) {
            this.resizeTimeout = clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = (setTimeout(() => {
            this.width = this.scrollContainer.offsetWidth;
            this.setFlippers();
        }, this.frameTime) as any) as number;
    }

    /**
     * Monitors scrolled event on the content container
     * @public
     */
    public scrolled(): void {
        if (this.scrollTimeout) {
            this.scrollTimeout = clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = (setTimeout(() => {
            this.setFlippers();
        }, this.frameTime) as any) as number;
    }
}
