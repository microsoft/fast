/**
 * AnimationTrigger callback contract
 */
export declare type ScrollTriggerCallback = (distance: any) => void;
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
    protected subscriptions: ScrollTriggerSubscription[];
    protected scrollDistance: number;
    private openRequestAnimationFrame;
    private useRequestAnimationFrame;
    private lastScrollY;
    constructor();
    /**
     * Subscribe an element and callback for scroll triggers
     */
    subscribe(element: HTMLElement, callback: ScrollTriggerCallback): void;
    /**
     * Unsubscribe an element and callback for scroll triggers
     */
    unsubscribe(element: HTMLElement, callback: ScrollTriggerCallback): void;
    /**
     * Make any arbitrary updates to UI
     */
    protected update(): void;
    /**
     * Checks to see if element/callback pairs have been registered so we don't duplicate registration.
     */
    private isSubscribed;
    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame;
}
