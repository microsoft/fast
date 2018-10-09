import * as React from "react";
import { canUseDOM } from "exenv-es6";
import { throttle } from "lodash-es";
import { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoints";

export interface BreakpointTrackerProps {
    /**
     * The render method
     */
    render: (activeBreakpoint: keyof Breakpoints) => React.ReactNode;
}

export interface BreakpointTrackerState {
    activeBreakpoint: keyof Breakpoints;
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
        if (canUseDOM()) {
            const initialBreakpoint: keyof Breakpoints = identifyBreakpoint(window.innerWidth, BreakpointTracker.breakpoints);

            this.setState({
                activeBreakpoint: initialBreakpoint
            });

            window.addEventListener("resize", this.requestFrame);
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(): void {
        if (canUseDOM()) {
            this.updateBreakpoint();
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
        const breakpoint: keyof Breakpoints = identifyBreakpoint(windowWidth, BreakpointTracker.breakpoints);

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
        if (this.openRequestAnimationFrame) {
            this.openRequestAnimationFrame = true;
            window.requestAnimationFrame(this.updateBreakpoint);
        }
    }
}
