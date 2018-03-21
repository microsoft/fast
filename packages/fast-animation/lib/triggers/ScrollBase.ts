import isElementInView from "../utilities/isElementInView";
import throttle from "lodash.throttle";
import scrollY from "../utilities/scrollY";

/**
 * AnimationTrigger callback contract
 */
export type ScrollTriggerCallback = (distance: any) => void;

/**
 * Export subscription interface
 */
export interface IScrollTriggerSubscription {
    element: HTMLElement;
    callback: ScrollTriggerCallback;
    inView: boolean;
}

/**
 * Scroll trigger base-class that handles event binding and element/callback registration.
 */
export default abstract class ScrollTrigger {
    protected subscriptions: IScrollTriggerSubscription[] = [];
    protected scrollDistance: number = 0;
    private openRequestAnimationFrame: boolean = false;
    private useRequestAnimationFrame: boolean = false;
    private lastScrollY: number;

    constructor() {
        this.useRequestAnimationFrame = window.hasOwnProperty("requestAnimationFrame");
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
        if (!(element instanceof HTMLElement) || typeof callback !== "function" || this.isSubscribed(element, callback)) {
            return;
        }

        if (this.subscriptions.length === 0) {
            if (this.useRequestAnimationFrame) {
                window.addEventListener("scroll", this.requestFrame);
            } else {
                // If we can't use window.requestAnimationFrame, just throttle the update method
                this.update = throttle(this.update, 1000 / 60); // 60fps
                window.addEventListener("scroll", this.update);
            }
        }

        this.subscriptions.push({ element, callback, inView: isElementInView(element) });
    }

    /**
     * Unsubscribe an element and callback for scroll triggers
     */
    public unsubscribe(element: HTMLElement, callback: ScrollTriggerCallback): void {
        this.subscriptions = this.subscriptions.filter((subscription: IScrollTriggerSubscription) => {
            return !(element === subscription.element && callback === subscription.callback);
        });

        if (this.subscriptions.length === 0) {
            window.removeEventListener("scroll", this.useRequestAnimationFrame ? this.requestFrame : this.update);
        }
    }

    /**
     * Make any arbitrary updates to UI
     */
    protected update(): void {
        const yOffset: number = scrollY();
        this.openRequestAnimationFrame = false;
        this.scrollDistance = yOffset - this.lastScrollY;
        this.lastScrollY = yOffset;
    }

    /**
     * Checks to see if element/callback pairs have been registered so we don't duplicate registration.
     */
    private isSubscribed(element: HTMLElement, callback: ScrollTriggerCallback): boolean {
        return !!this.subscriptions.filter((subscription: IScrollTriggerSubscription): boolean => {
            return element === subscription.element && callback === subscription.callback;
        }).length;
    }

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (this.openRequestAnimationFrame) {
            return;
        }

        this.openRequestAnimationFrame = true;
        window.requestAnimationFrame(this.update);
    }
}
