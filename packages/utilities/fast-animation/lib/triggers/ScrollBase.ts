import isElementInView from "../utilities/isElementInView";
import scrollY from "../utilities/scrollY";

/**
 * AnimationTrigger callback contract
 */
export type ScrollTriggerCallback = (distance: any) => void;

/**
 * Export subscription interface
 */
export interface ScrollTriggerSubscription {
    element: HTMLElement;
    callback: ScrollTriggerCallback;
    inView: boolean;
}

/**
 * Scroll trigger base-class that handles event binding and element/callback registration.
 */
export default abstract class ScrollTrigger {
    protected subscriptions: ScrollTriggerSubscription[] = [];
    protected scrollDistance: number = 0;
    private requestedFrame: number | void;
    private lastScrollY: number;

    constructor() {
        this.lastScrollY = scrollY();

        // We need to use .bind instead of lambda (fat-arrow) syntax here because
        // protected methods declared as lambda functions cannot be invoked by
        // extending classes via the `super` object
        this.update = this.update.bind(this);
    }

    /**
     * Subscribe an element and callback for scroll triggers
     */
    public subscribe(element: HTMLElement, callback: ScrollTriggerCallback): void {
        if (
            !(element instanceof HTMLElement) ||
            typeof callback !== "function" ||
            this.isSubscribed(element, callback)
        ) {
            return;
        }

        if (this.subscriptions.length === 0) {
            window.addEventListener("scroll", this.requestFrame);
        }

        this.subscriptions.push({
            element,
            callback,
            inView: isElementInView(element),
        });
    }

    /**
     * Unsubscribe an element and callback for scroll triggers
     */
    public unsubscribe(element: HTMLElement, callback: ScrollTriggerCallback): void {
        this.subscriptions = this.subscriptions.filter(
            (subscription: ScrollTriggerSubscription) => {
                return !(
                    element === subscription.element && callback === subscription.callback
                );
            }
        );

        if (this.subscriptions.length === 0) {
            window.removeEventListener("scroll", this.requestFrame);
        }
    }

    /**
     * Make any arbitrary updates to UI
     */
    protected update(): void {
        const yOffset: number = scrollY();
        this.scrollDistance = yOffset - this.lastScrollY;
        this.lastScrollY = yOffset;
    }

    /**
     * Checks to see if element/callback pairs have been registered so we don't duplicate registration.
     */
    private isSubscribed(element: HTMLElement, callback: ScrollTriggerCallback): boolean {
        return !!this.subscriptions.filter(
            (subscription: ScrollTriggerSubscription): boolean => {
                return (
                    element === subscription.element && callback === subscription.callback
                );
            }
        ).length;
    }

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (this.requestedFrame) {
            cancelAnimationFrame(this.requestedFrame);
        }

        this.requestedFrame = requestAnimationFrame(this.update);
    };
}
