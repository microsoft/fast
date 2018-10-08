import { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoints";

describe("identifyBreakpoint", (): void => {
    test("should return the correct breakpoint values", (): void => {
        expect(identifyBreakpoint(0, defaultBreakpoints)).toBe("vp1");
        expect(identifyBreakpoint(539, defaultBreakpoints)).toBe("vp1");
        expect(identifyBreakpoint(540, defaultBreakpoints)).toBe("vp2");
        expect(identifyBreakpoint(767, defaultBreakpoints)).toBe("vp2");
        expect(identifyBreakpoint(768, defaultBreakpoints)).toBe("vp3");
        expect(identifyBreakpoint(1083, defaultBreakpoints)).toBe("vp3");
        expect(identifyBreakpoint(1084, defaultBreakpoints)).toBe("vp4");
        expect(identifyBreakpoint(1399, defaultBreakpoints)).toBe("vp4");
        expect(identifyBreakpoint(1400, defaultBreakpoints)).toBe("vp5");
        expect(identifyBreakpoint(1778, defaultBreakpoints)).toBe("vp5");
        expect(identifyBreakpoint(1779, defaultBreakpoints)).toBe("vp6");
    });

    test("should return the correct breakpoint values when cust breakpoint values are passed", (): void => {
        const customBreakpoints: Breakpoints = {
            "vp1": 0,
            "vp3": 1000,
            "vp2": 600
        };

        expect(identifyBreakpoint(0, customBreakpoints)).toBe("vp0");
        expect(identifyBreakpoint(599, customBreakpoints)).toBe("vp0");
        expect(identifyBreakpoint(600, customBreakpoints)).toBe("vp1");
        expect(identifyBreakpoint(999, customBreakpoints)).toBe("vp1");
        expect(identifyBreakpoint(1000, customBreakpoints)).toBe("vp2");
    });
});
