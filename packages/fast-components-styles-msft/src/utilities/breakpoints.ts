export interface IBreakpoints {
    vp1: number;
    vp2: number;
    vp3: number;
    vp4: number;
    vp5: number;
    vp6: number;
}

/**
 * These are the minimum widths for the breakpoint
 */
export const breakpoints: IBreakpoints = {
    vp1: 0,
    vp2: 540,
    vp3: 768,
    vp4: 1084,
    vp5: 1400,
    vp6: 1779
};

export function applyBreakpoint(breakpoint: keyof IBreakpoints): string {
    return `@media only screen and (min-width: ${breakpoints[breakpoint]}px)`;
}
