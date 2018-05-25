import { canUseDOM } from "exenv-es6";

export type Breakpoint = number;

export type Breakpoints = Breakpoint[];

export const defaultBreakpoints: Breakpoints = [0, 540, 768, 1084, 1400, 1779];

/**
 * Identifies current breakpoint based on window width
 */
export function identifyBreakpoint(windowWidth: number, breakpoints: Breakpoints = defaultBreakpoints): number {
    for (let breakpoint: Breakpoint = breakpoints.length - 1; breakpoint >= 0; breakpoint--) {
        if (windowWidth >= breakpoints[breakpoint]) {
            return breakpoint;
        }
    }
}

/**
 * Gets a value from an array where the index retrieved is either the current break-point
 * or the nearest preceding break-point if no entry exists for the current break-point
 */
export function getValueByBreakpoint<T>(breakpointSet: T[], breakpoints?: Breakpoints): T {
    if (!canUseDOM()) {
        return breakpointSet[0];
    }

    const breakpoint: Breakpoint = breakpoints ? identifyBreakpoint(window.innerWidth, breakpoints) : identifyBreakpoint(window.innerWidth);

    return breakpointSet.slice(0, breakpoint + 1).pop();
}
