var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import {
    attr,
    booleanConverter,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
/**
 * A HorizontalScroll Custom HTML Element
 * @public
 */
export class HorizontalScroll extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * @internal
         */
        this.framesPerSecond = 120;
        /**
         * Flag indicating that the items are being updated
         *
         * @internal
         */
        this.updatingItems = false;
        /**
         * Speed of scroll in pixels per second
         * @public
         */
        this.speed = 600;
        /**
         * Attribute used for easing, defaults to ease-in-out
         * @public
         */
        this.easing = "ease-in-out";
        /**
         * Attribute to hide flippers from assistive technology
         * @public
         */
        this.flippersHiddenFromAT = false;
        /**
         * Scrolling state
         * @internal
         */
        this.scrolling = false;
        /**
         * Detects if the component has been resized
         * @internal
         */
        this.resizeDetector = null;
    }
    /**
     * The calculated duration for a frame.
     *
     * @internal
     */
    get frameTime() {
        return 1000 / this.framesPerSecond;
    }
    /**
     * In RTL mode
     * @internal
     */
    get isRtl() {
        return (
            this.scrollItems.length > 1 &&
            this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft
        );
    }
    connectedCallback() {
        super.connectedCallback();
        this.initializeResizeDetector();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectResizeDetector();
    }
    /**
     * Updates scroll stops and flippers when scroll items change
     * @param previous - current scroll items
     * @param next - new updated scroll items
     * @public
     */
    scrollItemsChanged(previous, next) {
        if (next && !this.updatingItems) {
            this.setStops();
        }
    }
    /**
     * destroys the instance's resize observer
     * @internal
     */
    disconnectResizeDetector() {
        if (this.resizeDetector) {
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }
    /**
     * initializes the instance's resize observer
     * @internal
     */
    initializeResizeDetector() {
        this.disconnectResizeDetector();
        this.resizeDetector = new window.ResizeObserver(this.resized.bind(this));
        this.resizeDetector.observe(this);
    }
    /**
     * Looks for slots and uses child nodes instead
     * @internal
     */
    updateScrollStops() {
        this.updatingItems = true;
        let updatedItems = [];
        this.scrollItems.forEach(item => {
            if (item instanceof HTMLSlotElement) {
                updatedItems = updatedItems.concat(item.assignedElements());
            } else {
                updatedItems.push(item);
            }
        });
        this.scrollItems = updatedItems;
        this.updatingItems = false;
    }
    /**
     * Finds all of the scroll stops between elements
     * @internal
     */
    setStops() {
        this.updateScrollStops();
        this.width = this.offsetWidth;
        let lastStop = 0;
        let stops = this.scrollItems
            .map(({ offsetLeft: left, offsetWidth: width }, index) => {
                const right = left + width;
                if (this.isRtl) {
                    return -right;
                }
                lastStop = right;
                return index === 0 ? 0 : left;
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
     *
     */
    fixScrollMisalign(stops) {
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
    setFlippers() {
        const position = this.scrollContainer.scrollLeft;
        if (this.previousFlipperContainer) {
            this.previousFlipperContainer.classList.toggle("disabled", position === 0);
        }
        if (this.nextFlipperContainer && this.scrollStops) {
            const lastStop = Math.abs(this.scrollStops[this.scrollStops.length - 1]);
            this.nextFlipperContainer.classList.toggle(
                "disabled",
                Math.abs(position) + this.width >= lastStop
            );
        }
    }
    /**
     * Lets the user arrow left and right through the horizontal scroll
     * @param e - Keyboard event
     * @public
     */
    keyupHandler(e) {
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
    scrollToPrevious() {
        const scrollPosition = this.scrollContainer.scrollLeft;
        const current = this.scrollStops.findIndex(
            (stop, index) =>
                stop <= scrollPosition &&
                (this.isRtl ||
                    index === this.scrollStops.length - 1 ||
                    this.scrollStops[index + 1] > scrollPosition)
        );
        const right = Math.abs(this.scrollStops[current + 1]);
        let nextIndex = this.scrollStops.findIndex(
            stop => Math.abs(stop) + this.width > right
        );
        if (nextIndex > current || nextIndex === -1) {
            nextIndex = current > 0 ? current - 1 : 0;
        }
        this.scrollToPosition(this.scrollStops[nextIndex], scrollPosition);
    }
    /**
     * Scrolls items to the right
     * @public
     */
    scrollToNext() {
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
        const nextStop = this.scrollStops[nextIndex];
        this.scrollToPosition(nextStop, scrollPosition);
    }
    /**
     * Handles scrolling with easing
     * @param position - starting position
     * @param newPosition - position to scroll to
     * @public
     */
    scrollToPosition(newPosition, position = this.scrollContainer.scrollLeft) {
        if (this.scrolling) {
            return;
        }
        this.scrolling = true;
        const steps = [];
        const direction = position < newPosition ? 1 : -1;
        const scrollDistance = Math.abs(newPosition - position);
        const seconds = scrollDistance / this.speed;
        const stepCount = Math.floor(this.framesPerSecond * seconds);
        if (stepCount < 1) {
            this.scrolling = false;
            return;
        }
        for (let i = 0; i < stepCount; i++) {
            const progress = i / stepCount;
            const easingFactor = this.getEasedFactor(this.easing, progress);
            const travel = scrollDistance * easingFactor * direction;
            steps.push(travel + position);
        }
        steps.push(newPosition);
        this.move(steps, this.frameTime);
    }
    /**
     *
     * @param steps - An array of positions to move
     * @param time - The duration between moves
     * @internal
     */
    move(steps, time) {
        if (!steps || steps.length <= 0) {
            this.setFlippers();
            this.scrolling = false;
            return;
        }
        this.moveStartTime = requestAnimationFrame(timestamp => {
            if (timestamp - this.moveStartTime >= time) {
                const nextStep = steps.shift();
                this.scrollContainer.scrollLeft =
                    nextStep !== null && nextStep !== void 0
                        ? nextStep
                        : this.scrollContainer.scrollLeft;
            }
            this.move(steps, time);
        });
    }
    /**
     * Monitors resize event on the horizontal-scroll element
     * @public
     */
    resized() {
        if (this.resizeTimeout) {
            this.resizeTimeout = clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.width = this.offsetWidth;
            this.setFlippers();
        }, this.frameTime);
    }
    /**
     * Monitors scrolled event on the content container
     * @public
     */
    scrolled() {
        if (this.scrollTimeout) {
            this.scrollTimeout = clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = setTimeout(() => {
            this.setFlippers();
        }, this.frameTime);
    }
    /**
     *
     * @param easing - Type of easing
     * @param progress - Progress completed, 0 - 1
     * @internal
     */
    getEasedFactor(easing, progress) {
        if (progress > 1) {
            progress = 1;
        }
        switch (easing) {
            case "ease-in":
                return Math.pow(progress, 1.675);
            case "ease-out":
                return 1 - Math.pow(1 - progress, 1.675);
            case "ease-in-out":
                return 0.5 * (Math.sin((progress - 0.5) * Math.PI) + 1);
            default:
                return progress;
        }
    }
}
__decorate(
    [attr({ converter: nullableNumberConverter })],
    HorizontalScroll.prototype,
    "speed",
    void 0
);
__decorate([attr], HorizontalScroll.prototype, "easing", void 0);
__decorate(
    [attr({ attribute: "aria-hidden", converter: booleanConverter })],
    HorizontalScroll.prototype,
    "flippersHiddenFromAT",
    void 0
);
__decorate([observable], HorizontalScroll.prototype, "scrollItems", void 0);
__decorate([attr({ attribute: "view" })], HorizontalScroll.prototype, "view", void 0);
