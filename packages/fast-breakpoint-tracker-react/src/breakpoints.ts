export type Breakpoint = number;

export type Breakpoints = Breakpoint[];

export const defaultBreakpoints: Breakpoints = [0, 540, 768, 1084, 1400, 1779];

/**
 * Identifies current breakpoint based on window width
 */
export function identifyBreakpoint(
    windowWidth: number,
    breakpoints: Breakpoints
): number {
    for (
        let breakpoint: Breakpoint = breakpoints.length - 1;
        breakpoint >= 0;
        breakpoint--
    ) {
        if (windowWidth >= breakpoints[breakpoint]) {
            return breakpoint;
        }
    }
}
