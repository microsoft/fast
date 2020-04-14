import { canUseDOM } from "exenv-es6";
import {
    Breakpoint,
    Breakpoints,
    defaultBreakpoints,
    identifyBreakpoint,
} from "./breakpoints";

export type BreakpointTrackerCallback = (breakpoint: Breakpoint) => void;

class BreakpointTracker {
    /**
     * The default array of breakpoint values
     */
    private _breakpoints: Breakpoints = defaultBreakpoints;

    /**
     * The current breakpoint.
     */
    private breakpoint: number;

    /**
     * Default breakpoint that can be set, used when the DOM is unavailable (useful for server side rendering)
     */
    private _defaultBreakpoint: Breakpoint = 0;

    /**
     * Track if we have an open animation frame request
     */
    private openRequestAnimationFrame: boolean;

    /**
     * The subscriptions
     */
    private subscriptions: BreakpointTrackerCallback[] = [];

    /**
     * Constructor for the BreakpointTracker component.
     * @param defaultBreakpoint?: number - optional breakpoint that can be used instead of window.innerWidth
     */
    constructor() {
        if (canUseDOM()) {
            this.breakpoint = identifyBreakpoint(window.innerWidth, this._breakpoints);
            window.addEventListener("resize", this.requestFrame);
        } else {
            this.breakpoint = this.defaultBreakpoint;
        }
    }

    /**
     * Gets breakpoint values
     */
    public get breakpoints(): Breakpoints {
        return this._breakpoints;
    }

    /**
     * Sets breakpoint values
     */
    public set breakpoints(breakpointConfig: Breakpoints) {
        this._breakpoints = breakpointConfig;
        this.update();
    }

    /**
     * Gets the default breakpoint value
     */
    public get defaultBreakpoint(): Breakpoint {
        return this._defaultBreakpoint;
    }

    /**
     * Sets the default breakpoint value
     */
    public set defaultBreakpoint(breakpoint: Breakpoint) {
        this._defaultBreakpoint = breakpoint;
        this.update();
    }

    /**
     * Subscribes a callback to be called when breakpoints change
     */
    public subscribe(callback: BreakpointTrackerCallback): void {
        if (!this.subscriptions.includes(callback)) {
            this.subscriptions.push(callback);
        }
    }

    /**
     * Unsubscribes a callback from the breakpoint tracker
     */
    public unsubscribe(callback: BreakpointTrackerCallback): void {
        this.subscriptions = this.subscriptions.filter(
            (subscription: BreakpointTrackerCallback) => callback !== subscription
        );
    }

    /**
     * Notifies subscribes if a breakpoint threshold has been crossed
     */
    public update = (): void => {
        const breakpoint: Breakpoint = canUseDOM()
            ? identifyBreakpoint(window.innerWidth, this._breakpoints)
            : this.defaultBreakpoint;

        if (this.breakpoint !== breakpoint) {
            this.breakpoint = breakpoint;
            this.notifySubscribers(this.breakpoint);
        }

        this.openRequestAnimationFrame = false;
    };

    /**
     * Returns the current breakpoint
     */
    public currentBreakpoint = (): Breakpoint => {
        return this.breakpoint;
    };

    /**
     * Call all subscribed callbacks
     */
    public notifySubscribers(breakpoint: Breakpoint): void {
        this.subscriptions.forEach((subscription: BreakpointTrackerCallback) => {
            subscription(breakpoint);
        });
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
    };
}

export default new BreakpointTracker();
