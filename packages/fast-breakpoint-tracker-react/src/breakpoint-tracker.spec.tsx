import * as React from "react";
import { configure, mount } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { Breakpoints, defaultBreakpoints } from "./breakpoints";
import { BreakpointTracker } from "./breakpoint-tracker";

configure({adapter: new Adapter()});

const globalAny: any = global;

describe("BreakpointTracker", (): void => {

    function renderChild(breakpoint: string): JSX.Element {
        return <p>{breakpoint}</p>;
    }

    test("should pass active breakpoint value in the render prop", (): void => {
        // update window.innerWidth to 1300 ("vp4")
        globalAny.window.innerWidth = 1300;

        const rendered: any = mount(
            <BreakpointTracker
                render={renderChild}
            />
        );

        expect(rendered.state("activeBreakpoint")).toBe("vp4");
        expect(rendered.find("p").text()).toEqual("vp4");
    });

    test("should provide default breakpoint values", (): void => {
        // reset window.innerWidth to 1024 ("vp3")
        globalAny.window.innerWidth = 1024;

        const rendered: any = mount(
            <BreakpointTracker
                render={renderChild}
            />
        );

        expect(BreakpointTracker.breakpoints).toEqual(defaultBreakpoints);
        expect(rendered.state("activeBreakpoint")).toEqual("vp3");
    });

    test("should allow custom breakpoints to be set", (): void => {
        const customBreakpoints: Breakpoints = {
            viewport0: 0,
            viewport1: 800,
            viewport2: 1000,
            viewport3: 1500
        };

        // window.innerWidth is 1024 ("viewport2")
        BreakpointTracker.breakpoints = customBreakpoints;

        const rendered: any = mount(
            <BreakpointTracker
                render={renderChild}
            />
        );

        expect(rendered.state("activeBreakpoint")).toEqual("viewport2");
    });

    test("should add resize event listener to the window", (): void => {
        const map: any = {};
        const resizeCallback: any = jest.fn();

        // Mock window.removeEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            // if an event is added for resize, add a callback to mock
            if (event === "resize") {
                callback = resizeCallback;
            }

            map[event] = callback;
        });

        const rendered: any = mount(
            <BreakpointTracker
                render={renderChild}
            />
        );

        map.resize();

        expect(resizeCallback).toHaveBeenCalledTimes(1);
    });

    test("should remove resize event listener from the window when component unmounts", (): void => {
        const map: any = {};
        const resizeCallback: any = jest.fn();

        // Mock window.removeEventListener
        window.removeEventListener = jest.fn((event: string, callback: any) => {
            // if an event is added for resize, add a callback to mock
            if (event === "resize") {
                callback = resizeCallback;
            }

            map[event] = callback;
        });

        const rendered: any = mount(
            <BreakpointTracker
                render={renderChild}
            />
        );

        rendered.unmount();

        map.resize();

        expect(resizeCallback).toHaveBeenCalledTimes(1);
    });
});
