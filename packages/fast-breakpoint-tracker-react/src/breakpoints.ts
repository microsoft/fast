export type Breakpoints = number[];

export const defaultBreakpoints: Breakpoints = [0, 540, 768, 1084, 1400, 1779];

/**
 * Identifies current breakpoint based on window width
 */
export function identifyBreakpoint(
    windowWidth: number,
    breakpoints: Breakpoints
): number {
    for (let breakpoint: number = breakpoints.length - 1; breakpoint >= 0; breakpoint--) {
        if (windowWidth >= breakpoints[breakpoint]) {
            return breakpoint;
        }
    }
}
