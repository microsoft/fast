import { canUseDOM } from "exenv-es6";
import BreakpointTracker, { BreakpointTrackerCallback } from "./breakpoint-tracker";
import { Breakpoints, defaultBreakpoints } from "./breakpoints";
jest.mock("exenv-es6", () => ({ canUseDOM: jest.fn() }));

describe("breakpointTracker", (): void => {
    let subscriber: any;
    let callback: any;

    beforeEach(() => {
        // reset the BreakpointTracker singleton private fields between each test
        BreakpointTracker["_breakpoints"] = defaultBreakpoints;
        BreakpointTracker["breakpoint"] = 0;
        BreakpointTracker["_defaultBreakpoint"] = 0;
        BreakpointTracker["openRequestAnimationFrame"] = false;
        BreakpointTracker["subscriptions"] = [];
        canUseDOM["mockImplementation"](() => true);

        subscriber = {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            onBreakpointChanged: (notification: BreakpointTrackerCallback): void => {
                return;
            },
        };

        callback = jest.fn();
    });

    test("should successfully track subscribers", (): void => {
        BreakpointTracker.subscribe(callback);
        BreakpointTracker.notifySubscribers(1);

        expect(callback).toBeCalled();
    });

    test("should successfully remove subscribers", (): void => {
        BreakpointTracker.subscribe(callback);
        BreakpointTracker.unsubscribe(callback);
        BreakpointTracker.notifySubscribers(2);

        expect(callback).not.toBeCalled();
    });

    test("should initialize with default breakpoint values", (): void => {
        BreakpointTracker.subscribe(subscriber.onBreakpointChange);

        expect(BreakpointTracker.breakpoints).toEqual(defaultBreakpoints);
    });

    test("should provide a breakpoint value when `currentBreakpoint` is called", (): void => {
        BreakpointTracker.subscribe(subscriber.onBreakpointChange);

        expect(typeof BreakpointTracker.currentBreakpoint() === "number").toBe(true);
    });

    test("should set new breakpoint values when provided", (): void => {
        const newBreakpoints: Breakpoints = [0, 500, 900, 1400];

        // Expect default values
        expect(BreakpointTracker.breakpoints).toEqual(defaultBreakpoints);

        // Set new values
        BreakpointTracker.breakpoints = newBreakpoints;

        // Expect new values
        expect(BreakpointTracker.breakpoints).toEqual(newBreakpoints);

        // Update to default values
        BreakpointTracker.breakpoints = defaultBreakpoints;

        // Expect default values
        expect(BreakpointTracker.breakpoints).toEqual(defaultBreakpoints);
    });

    test("should update `currentBreakpoint` value when new breakpoint values provided", (): void => {
        const breakpointsOne: Breakpoints = [0, 500, 900, 1400];
        const breakpointsTwo: Breakpoints = [0, 200, 400, 600, 800];

        // set innerWidth to 700
        (window as any)["innerWidth"] = 700;

        // Set breakpoints set one
        BreakpointTracker.breakpoints = breakpointsOne;

        // Expect new values
        expect(BreakpointTracker.currentBreakpoint()).toEqual(1);

        // Set breakpoints set two
        BreakpointTracker.breakpoints = breakpointsTwo;

        // Expect new values
        expect(BreakpointTracker.currentBreakpoint()).toEqual(3);

        // Update to default values
        BreakpointTracker.breakpoints = defaultBreakpoints;
    });

    test("should return the default breakpoint set when the DOM is unavailable", (): void => {
        // make DOM unavailable for test
        canUseDOM["mockImplementation"](() => false);
        expect(canUseDOM()).toEqual(false);

        // Set some default breakpoints
        const breakpoints: Breakpoints = [0, 500, 900, 1400];
        BreakpointTracker.breakpoints = breakpoints;

        // no default breakpoint specified, default breakpoint defaults to zero
        expect(BreakpointTracker.currentBreakpoint()).toEqual(0);

        // Update the default breakpoint
        BreakpointTracker.defaultBreakpoint = 3;

        // Expect breakpoint to have updated
        expect(BreakpointTracker.currentBreakpoint()).toEqual(3);
    });
});
