import * as React from "react";
import { canUseDOM } from "exenv-es6";
import { throttle } from "lodash-es";
import { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoints";

export interface BreakpointTrackerProps {
    breakpoints?: Breakpoints;

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

        if (this.props.breakpoints) {
            BreakpointTracker.breakpoints = this.props.breakpoints;
        }
    }

    public componentDidMount(): void {
        if (!canUseDOM()) {
            return;
        }

        const initialBreakpoint: keyof Breakpoints = identifyBreakpoint(window.innerWidth, BreakpointTracker.breakpoints);

        this.setState({
            activeBreakpoint: initialBreakpoint
        });

        window.addEventListener("resize", this.requestFrame);
    }

    public componentDidUpdate(prevProps: BreakpointTrackerProps): void {
        if (prevProps.breakpoints !== this.props.breakpoints) {
            this.updateBreakpoint();
        }
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
            return;
        }

        this.openRequestAnimationFrame = true;
        window.requestAnimationFrame(this.updateBreakpoint);
    }
}
