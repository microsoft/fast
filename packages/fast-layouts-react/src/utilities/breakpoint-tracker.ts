import { canUseDOM } from "exenv-es6";
import { throttle } from "lodash-es";
import {
    Breakpoint,
    Breakpoints,
    defaultBreakpoints,
    identifyBreakpoint,
} from "./breakpoints";

export type BreakpointTrackerCallback = (breakpoint: Breakpoint) => void;

export class BreakpointTracker {
    /**
     * The default array of breakpoint values
     */
    private _breakpoints: Breakpoints = defaultBreakpoints;

    /**
     * The current breakpoint.
     */
    private breakpoint: number;

    /**
     * Track if we have an open animation frame request
     */
    private openRequestAnimationFrame: boolean;

    /**
     * The subscriptions
     */
    private subscriptions: BreakpointTrackerCallback[] = [];

    /**
     * Default breakpoint that can be set (useful for server side rendering)
     */
    private defaultBreakpoint: number = 0;

    /**
     * Constructor for the BreakpointTracker component.
     * @param defaultBreakpoint?: number - optional breakpoint that can be used instead of window.innerWidth
     */
    constructor(defaultBreakpoint?: number) {
        this.defaultBreakpoint = defaultBreakpoint;

        this.breakpoint = canUseDOM()
            ? identifyBreakpoint(window.innerWidth, this._breakpoints)
            : this.defaultBreakpoint;

        if (canUseDOM()) {
            window.addEventListener("resize", this.requestFrame);
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

        this.breakpoint = canUseDOM()
            ? identifyBreakpoint(window.innerWidth, this._breakpoints)
            : this.defaultBreakpoint;
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

        if (canUseDOM()) {
            window.requestAnimationFrame(this.update);
        }
    };
}
