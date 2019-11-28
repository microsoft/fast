import { BreakpointTracker, BreakpointTrackerCallback } from "./breakpoint-tracker";
import { Breakpoints, defaultBreakpoints } from "./breakpoints";

/* tslint:disable:no-string-literal */
describe("breakpointTracker", (): void => {
    let subscriber: any;
    let callback: any;
    let breakpointTracker: BreakpointTracker = new BreakpointTracker();

    beforeEach(() => {
        subscriber = {
            onBreakpointChanged: (notification: BreakpointTrackerCallback): void => {
                return;
            },
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

        expect(breakpointTracker.breakpoints).toEqual(defaultBreakpoints);
    });

    test("should provide a breakpoint value when `currentBreakpoint` is called", (): void => {
        breakpointTracker.subscribe(subscriber.onBreakpointChange);

        expect(typeof breakpointTracker.currentBreakpoint() === "number").toBe(true);
    });

    test("should set new breakpoint values when provided", (): void => {
        const newBreakpoints: Breakpoints = [0, 500, 900, 1400];

        // Expect default values
        expect(breakpointTracker.breakpoints).toEqual(defaultBreakpoints);

        // Set new values
        breakpointTracker.breakpoints = newBreakpoints;

        // Expect new values
        expect(breakpointTracker.breakpoints).toEqual(newBreakpoints);

        // Update to default values
        breakpointTracker.breakpoints = defaultBreakpoints;

        // Expect default values
        expect(breakpointTracker.breakpoints).toEqual(defaultBreakpoints);
    });

    test("should update `currentBreakpoint` value when new breakpoint values provided", (): void => {
        const breakpointsOne: Breakpoints = [0, 500, 900, 1400];
        const breakpointsTwo: Breakpoints = [0, 200, 400, 600, 800];

        // set innerWidth to 700
        (window as any)["innerWidth"] = 700;

        // Set breakpoints set one
        breakpointTracker.breakpoints = breakpointsOne;

        // Expect new values
        expect(breakpointTracker.currentBreakpoint()).toEqual(1);

        // Set breakpoints set two
        breakpointTracker.breakpoints = breakpointsTwo;

        // Expect new values
        expect(breakpointTracker.currentBreakpoint()).toEqual(3);

        // Update to default values
        breakpointTracker.breakpoints = defaultBreakpoints;
    });
});
