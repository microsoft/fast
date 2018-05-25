import breakpointTracker, { BreakpointTrackerCallback } from "./breakpoint-tracker";
import { Breakpoints, defaultBreakpoints, identifyBreakpoint } from "./breakpoints";

describe("identifyBreakpoint", (): void => {
    test("should return the correct breakpoint values", (): void => {
        expect(identifyBreakpoint(0)).toBe(0);
        expect(identifyBreakpoint(539)).toBe(0);
        expect(identifyBreakpoint(540)).toBe(1);
        expect(identifyBreakpoint(767)).toBe(1);
        expect(identifyBreakpoint(768)).toBe(2);
        expect(identifyBreakpoint(1083)).toBe(2);
        expect(identifyBreakpoint(1084)).toBe(3);
        expect(identifyBreakpoint(1399)).toBe(3);
        expect(identifyBreakpoint(1400)).toBe(4);
        expect(identifyBreakpoint(1778)).toBe(4);
        expect(identifyBreakpoint(1779)).toBe(5);
    });

    test("should return the correct breakpoint values when cust breakpoint values are passed", (): void => {
        const customBreakpoints: Breakpoints = [0, 600, 1000];

        expect(identifyBreakpoint(0, customBreakpoints)).toBe(0);
        expect(identifyBreakpoint(599, customBreakpoints)).toBe(0);
        expect(identifyBreakpoint(600, customBreakpoints)).toBe(1);
        expect(identifyBreakpoint(999, customBreakpoints)).toBe(1);
        expect(identifyBreakpoint(1000, customBreakpoints)).toBe(2);
    });
});

/* tslint:disable:no-string-literal */
describe("breakpointTracker", (): void => {
    let subscriber: any;
    let callback: any;

    beforeEach(() => {
        subscriber = {
            onBreakpointChanged: (notification: BreakpointTrackerCallback): void => {
                return;
            }
        };

        callback = jest.fn();
    });

    test("should successfully track subscribers", (): void => {
        breakpointTracker.subscribe(callback);
        breakpointTracker.notifySubscribers(1);

        expect(callback).toBeCalled();
    });

    test("should successfully remove subscribers", (): void => {
        breakpointTracker.subscribe(callback);
        breakpointTracker.unsubscribe(callback);
        breakpointTracker.notifySubscribers(2);

        expect(callback).not.toBeCalled();
    });

    test("should initialize with default breakpoint values", (): void => {
        breakpointTracker.subscribe(subscriber.onBreakpointChange);

        expect(breakpointTracker["breakpointConfig"]).toEqual(defaultBreakpoints);
    });

    test("should set new breakpoint values in config when passed during subscribe", (): void => {
        const newBreakpoints: Breakpoints = [0, 500, 900, 1400];

        breakpointTracker.subscribe(subscriber.onBreakpointChange, newBreakpoints);

        expect(breakpointTracker["breakpointConfig"]).toEqual(newBreakpoints);
    });
});
/* tslint:enable:no-string-literal */
