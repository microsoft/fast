import breakpointTracker, { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoint-tracker";

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
});

/* tslint:disable:no-string-literal */
describe("breakpointTracker", (): void => {
    beforeEach(() => {
        const onBreakpointChange: any = (): any => true;
    });

    test("should initialize automatically without the 'new' keyword", (): void => {
        expect(breakpointTracker).toBeDefined();
        expect(breakpointTracker).toBeTruthy();
    });

    test("should successfully track subscribers", (): void => {
        expect(breakpointTracker["subscriptions"].length).toBe(0);

        breakpointTracker.subscribe(this.onBreakpointChange);

        expect(breakpointTracker["subscriptions"].length).toBe(1);
    });

    test("should successfully remove subscribers", (): void => {
        breakpointTracker.subscribe(this.onBreakpointChange);

        expect(breakpointTracker["subscriptions"].length).toBe(1);

        breakpointTracker.unsubscribe(this.onBreakpointChange);

        expect(breakpointTracker["subscriptions"].length).toBe(0);
    });

    test("should initialize with default breakpoint values", (): void => {
        breakpointTracker.subscribe(this.onBreakpointChange);

        expect(breakpointTracker["_breakpointConfig"]).toEqual(defaultBreakpoints);
    });

    test("should set new breakpoint values in config when passed during subscribe", (): void => {
        const newBreakpoints: Breakpoints = [0, 500, 900, 1400];

        breakpointTracker.subscribe(this.onBreakpointChange, newBreakpoints);

        expect(breakpointTracker["_breakpointConfig"]).toEqual(newBreakpoints);
    });
});
/* tslint:enable:no-string-literal */
