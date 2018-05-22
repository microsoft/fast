import { canUseDOM } from "exenv-es6";
import { throttle } from "lodash-es";

export type Breakpoint = number;

export type Breakpoints = Breakpoint[];

export type BreakpointTrackerCallback = (breakpoint: Breakpoint) => void;

export const defaultBreakpoints: Breakpoints = [0, 540, 768, 1084, 1400, 1779];

/**
 * Identifies current breakpoint based on window width
 */
export function identifyBreakpoint(windowWidth: number, breakpoints: Breakpoints): number {
    for (let breakpoint: Breakpoint = breakpoints.length - 1; breakpoint >= 0; breakpoint--) {
        if (windowWidth >= breakpoints[breakpoint]) {
            return breakpoint;
        }
    }
}

export class BreakpointTracker {

    /**
     * The current breakpoint.
     */
    private breakpoint: number;

    /**
     * The current breakpoint.
     */
    private _breakpointConfig: Breakpoints = defaultBreakpoints;

    /**
     * Store if requestAnimationFrame can be used
     */
    private useRequestAnimationFrame: boolean;

    /**
     * Track if we have an open animation frame request
     */
    private openRequestAnimationFrame: boolean;

    /**
     *
     */
    private subscriptions: BreakpointTrackerCallback[];

    /**
     * Stores breakpoint config
     */
    private get breakpointConfig(): Breakpoints {
        return this._breakpointConfig;
    }

    /**
     * Sets breakpoint config
     */
    private set breakpointConfig(config: Breakpoints) {
        this._breakpointConfig = config;
    }

    /**
     * Constructor for the BreakpointTracker component.
     */
    constructor() {
        if (!canUseDOM()) {
            return;
        }

        this.subscriptions = [];
        this.breakpoint = identifyBreakpoint(window.innerWidth, this._breakpointConfig);
        this.useRequestAnimationFrame = window.hasOwnProperty("requestAnimationFrame");

        if (!this.useRequestAnimationFrame) {
            // If we can't use window.requestAnimationFrame, just throttle the update method
            this.update = throttle(this.update, 1000 / 60); // 60fps
            window.addEventListener("resize", this.update);
        } else {
            window.addEventListener("resize", this.requestFrame);
        }
    }

    /**
     * Subscribes a callback to be called when breakpoints change
     */
    public subscribe(callback: BreakpointTrackerCallback, breakpointConfig?: Breakpoints): void {
        if (breakpointConfig) {
            this.breakpointConfig = breakpointConfig;
        }

        if (!this.subscriptions.includes(callback)) {
            this.subscriptions.push(callback);
        }
    }

    /**
     * Unsubscribes a callback from the breakpoint tracker
     */
    public unsubscribe(callback: BreakpointTrackerCallback): void {
        this.subscriptions = this.subscriptions.filter((subscription: BreakpointTrackerCallback) => callback !== subscription);
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

    /**
     * Notifies subscribes if a breakpoint threshold has been crossed
     */
    private update = (): void => {
        const windowWidth: number = window.innerWidth;
        const breakpoint: Breakpoint = identifyBreakpoint(windowWidth, this._breakpointConfig);

        if (this.breakpoint !== breakpoint) {
            this.breakpoint = breakpoint;
            this.notifySubscribers(this.breakpoint);
        }

        this.openRequestAnimationFrame = false;
    }

    /**
     * Call all subscribed callbacks
     */
    private notifySubscribers(breakpoint: Breakpoint): void {
        this.subscriptions.forEach((subscription: BreakpointTrackerCallback) => {
            subscription(breakpoint);
        });
    }
}

export default new BreakpointTracker();
