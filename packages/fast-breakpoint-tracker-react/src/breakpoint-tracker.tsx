import * as React from "react";
import { canUseDOM } from "exenv-es6";
import { throttle } from "lodash-es";
import { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoints";

export interface BreakpointTrackerProps {
    /**
     * The render method
     */
    render: (activeBreakpoint: keyof Breakpoints | void) => React.ReactNode;
}

export interface BreakpointTrackerState {
    activeBreakpoint: keyof Breakpoints | void;
}

export class BreakpointTracker extends React.Component<BreakpointTrackerProps, BreakpointTrackerState> {
    /**
     * The current breakpoint.
     */
    public static breakpoints: Breakpoints = defaultBreakpoints;

    /**
     * Track if we have an open animation frame request
     */
    private openRequestAnimationFrame: boolean;

    /**
     * Constructor for the BreakpointTracker component.
     */
    constructor(props: BreakpointTrackerProps) {
        super(props);

        this.state = {
            activeBreakpoint: null
        };
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        // We are doing this work in a lifecycle method instead of the constructor to ensure that
        // server rendered instances with conditional DOM rendering by breakpoint will be re-rendered.
        // ReactDOM.hydrate() will call the constructor again, but it does not trigger a re-render. It will only bind event handlers.
        // The only way to ensure the correct DOM is consistently rendered on the client is to perform this work here.
        if (canUseDOM()) {
            const initialBreakpoint: keyof Breakpoints | void = identifyBreakpoint(window.innerWidth, BreakpointTracker.breakpoints);

            this.setState({
                activeBreakpoint: initialBreakpoint
            });

            window.addEventListener("resize", this.requestFrame);
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (canUseDOM()) {
            window.removeEventListener("resize", this.requestFrame);
        }
    }

    public render(): React.ReactNode {
        return this.props.render(this.state.activeBreakpoint);
    }

    /**
     * Updates the active breakpoint
     */
    private updateBreakpoint = (): void => {
        const windowWidth: number = window.innerWidth;
        const breakpoint: keyof Breakpoints | void = identifyBreakpoint(windowWidth, BreakpointTracker.breakpoints);

        if (this.state.activeBreakpoint !== breakpoint) {
            this.setState({
                activeBreakpoint: breakpoint
            });
        }

        this.openRequestAnimationFrame = false;
    }

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (!this.openRequestAnimationFrame) {
            this.openRequestAnimationFrame = true;
            window.requestAnimationFrame(this.updateBreakpoint);
        }
    }
}
