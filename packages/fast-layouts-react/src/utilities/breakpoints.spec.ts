import { Breakpoints, getValueByBreakpoint, identifyBreakpoint } from "./breakpoints";

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
describe("getValueByBreakpoint", (): void => {
    test("should return the correct breakpoint with default values when `breakpoints` param is not passed", (): void => {
        // Default window.innerWidth for Jest is 1024
        expect(getValueByBreakpoint([12])).toBe(12);
        expect(getValueByBreakpoint([5, 4, 3])).toBe(3);
        expect(getValueByBreakpoint([10, 8, 6, 4, 2])).toBe(6);

        // set innerWidth to 1399
        window["innerWidth"] = 1399;

        expect(getValueByBreakpoint([12, 8, 6, 4, 2])).toBe(4);

        // set innerWidth to 1800
        window["innerWidth"] = 1800;

        expect(getValueByBreakpoint([12, 10, 8, 6, 4, 2])).toBe(2);

        // set innerWidth to 676
        window["innerWidth"] = 676;

        expect(getValueByBreakpoint([12, 10, 8, 6, 4, 2])).toBe(10);
    });

    test("should return the correct breakpoint from an array when custom `breakpoints` are passed", (): void => {
        const customBreakpoints: Breakpoints = [0, 600, 1000];
        // Reset window.innerWidth for Jest to 1024
        window["innerWidth"] = 1024;

        expect(getValueByBreakpoint([12], customBreakpoints)).toBe(12);
        expect(getValueByBreakpoint([5, 3], customBreakpoints)).toBe(3);
        expect(getValueByBreakpoint([10, 6, 2], customBreakpoints)).toBe(2);

        // set innerWidth to 500
        window["innerWidth"] = 500;

        expect(getValueByBreakpoint([12, 8, 6], customBreakpoints)).toBe(12);

        // set innerWidth to 800
        window["innerWidth"] = 800;

        expect(getValueByBreakpoint([6, 4, 2], customBreakpoints)).toBe(4);

        // set innerWidth to 600
        window["innerWidth"] = 600;

        expect(getValueByBreakpoint([12, 10, 8], customBreakpoints)).toBe(10);
    });
});
/* tslint:enable:no-string-literal */
