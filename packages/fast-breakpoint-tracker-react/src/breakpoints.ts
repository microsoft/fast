export interface Breakpoints {
    [key: string]: number;
}

export const defaultBreakpoints: Breakpoints = {
    vp1: 0,
    vp2: 540,
    vp3: 768,
    vp4: 1084,
    vp5: 1400,
    vp6: 1779
};

/**
 * Identifies current breakpoint based on window width
 */
export function identifyBreakpoint(windowWidth: number, breakpoints: Breakpoints): any {
    const breakpointArray: any = Object.keys(breakpoints).map(
        (key: keyof Breakpoints, value: number) => ({key, value: breakpoints[key]})
    ).sort((a: any, b: any) => a.value - b.value );

    for (let i: number = breakpointArray.length - 1; i >= 0; i--) {
        if (windowWidth >= breakpointArray[i].value) {
            return breakpointArray[i].key;
        }
    }
}
