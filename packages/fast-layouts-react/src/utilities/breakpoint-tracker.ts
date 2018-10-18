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
     * The current breakpoint.
     */
    private breakpoint: number;

    /**
     * The current breakpoint.
     */
    private breakpointConfig: Breakpoints = defaultBreakpoints;

    /**
     * Track if we have an open animation frame request
     */
    private openRequestAnimationFrame: boolean;

    /**
     *
     */
    private subscriptions: BreakpointTrackerCallback[];

    /**
     * Constructor for the BreakpointTracker component.
     */
    constructor() {
        if (!canUseDOM()) {
            return;
        }

        this.subscriptions = [];
        this.breakpoint = identifyBreakpoint(window.innerWidth, this.breakpointConfig);

        window.addEventListener("resize", this.requestFrame);
    }

    /**
     * Subscribes a callback to be called when breakpoints change
     */
    public subscribe(
        callback: BreakpointTrackerCallback,
        breakpointConfig?: Breakpoints
    ): void {
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
        this.subscriptions = this.subscriptions.filter(
            (subscription: BreakpointTrackerCallback) => callback !== subscription
        );
    }

    /**
     * Notifies subscribes if a breakpoint threshold has been crossed
     */
    public update = (): void => {
        const windowWidth: number = window.innerWidth;
        const breakpoint: Breakpoint = identifyBreakpoint(
            windowWidth,
            this.breakpointConfig
        );

        if (this.breakpoint !== breakpoint) {
            this.breakpoint = breakpoint;
            this.notifySubscribers(this.breakpoint);
        }

        this.openRequestAnimationFrame = false;
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
