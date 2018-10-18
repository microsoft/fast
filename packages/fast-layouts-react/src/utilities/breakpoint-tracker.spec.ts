import breakpointTracker, { BreakpointTrackerCallback } from "./breakpoint-tracker";
import { Breakpoints, defaultBreakpoints } from "./breakpoints";

/* tslint:disable:no-string-literal */
describe("breakpointTracker", (): void => {
    let subscriber: any;
    let callback: any;

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

        expect(breakpointTracker["breakpointConfig"]).toEqual(defaultBreakpoints);
    });

    test("should set new breakpoint values in config when passed during subscribe", (): void => {
        const newBreakpoints: Breakpoints = [0, 500, 900, 1400];

        breakpointTracker.subscribe(subscriber.onBreakpointChange, newBreakpoints);

        expect(breakpointTracker["breakpointConfig"]).toEqual(newBreakpoints);
    });
});
/* tslint:enable:no-string-literal */
