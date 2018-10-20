import { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoints";

describe("identifyBreakpoint", (): void => {
    test("should return the correct breakpoint values", (): void => {
        expect(identifyBreakpoint(0, defaultBreakpoints)).toBe(0);
        expect(identifyBreakpoint(539, defaultBreakpoints)).toBe(0);
        expect(identifyBreakpoint(540, defaultBreakpoints)).toBe(1);
        expect(identifyBreakpoint(767, defaultBreakpoints)).toBe(1);
        expect(identifyBreakpoint(768, defaultBreakpoints)).toBe(2);
        expect(identifyBreakpoint(1083, defaultBreakpoints)).toBe(2);
        expect(identifyBreakpoint(1084, defaultBreakpoints)).toBe(3);
        expect(identifyBreakpoint(1399, defaultBreakpoints)).toBe(3);
        expect(identifyBreakpoint(1400, defaultBreakpoints)).toBe(4);
        expect(identifyBreakpoint(1778, defaultBreakpoints)).toBe(4);
        expect(identifyBreakpoint(1779, defaultBreakpoints)).toBe(5);
    });

    test("should return the correct breakpoint values when custom breakpoint values are passed", (): void => {
        const customBreakpoints: Breakpoints = [0, 600, 1000];

        expect(identifyBreakpoint(0, customBreakpoints)).toBe(0);
        expect(identifyBreakpoint(599, customBreakpoints)).toBe(0);
        expect(identifyBreakpoint(600, customBreakpoints)).toBe(1);
        expect(identifyBreakpoint(999, customBreakpoints)).toBe(1);
        expect(identifyBreakpoint(1000, customBreakpoints)).toBe(2);
    });
});
