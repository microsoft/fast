import { throttle } from "lodash-es";
import isElementInView from "../utilities/isElementInView";
import scrollY from "../utilities/scrollY";
/**
 * Scroll trigger base-class that handles event binding and element/callback registration.
 */
export default class ScrollTrigger {
    constructor() {
        this.subscriptions = [];
        this.scrollDistance = 0;
        this.openRequestAnimationFrame = false;
        this.useRequestAnimationFrame = false;
        /**
         * Request's an animation frame if there are currently no open animation frame requests
         */
        this.requestFrame = () => {
            if (this.openRequestAnimationFrame) {
                return;
            }
            this.openRequestAnimationFrame = true;
            window.requestAnimationFrame(this.update);
        };
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
    subscribe(element, callback) {
        if (
            !(element instanceof HTMLElement) ||
            typeof callback !== "function" ||
            this.isSubscribed(element, callback)
        ) {
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
        this.subscriptions.push({
            element,
            callback,
            inView: isElementInView(element),
        });
    }
    /**
     * Unsubscribe an element and callback for scroll triggers
     */
    unsubscribe(element, callback) {
        this.subscriptions = this.subscriptions.filter(subscription => {
            return !(
                element === subscription.element && callback === subscription.callback
            );
        });
        if (this.subscriptions.length === 0) {
            window.removeEventListener(
                "scroll",
                this.useRequestAnimationFrame ? this.requestFrame : this.update
            );
        }
    }
    /**
     * Make any arbitrary updates to UI
     */
    update() {
        const yOffset = scrollY();
        this.openRequestAnimationFrame = false;
        this.scrollDistance = yOffset - this.lastScrollY;
        this.lastScrollY = yOffset;
    }
    /**
     * Checks to see if element/callback pairs have been registered so we don't duplicate registration.
     */
    isSubscribed(element, callback) {
        return !!this.subscriptions.filter(subscription => {
            return element === subscription.element && callback === subscription.callback;
        }).length;
    }
}
