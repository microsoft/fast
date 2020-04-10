import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import { UseTimeout } from "./use-timeout";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

/**
 * Mock timers
 */
jest.useFakeTimers();

describe("use-timeout", (): void => {
    test("should throw if the provided callback is not a function", (): void => {
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: null,
                children: <div>Hello world</div>,
            })
        );

        expect(() => {
            jest.runAllTimers();
        }).toThrow();
    });

    test("should call a callback after the provided period of time", (): void => {
        const spy: jest.Mock = jest.fn();
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
            })
        );

        jest.runAllTimers();
        expect(spy).toHaveBeenCalledTimes(1);
    });
    test("should provided callback when delay is changed", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
            })
        );

        rendered.setProps({ delay: 200 });

        jest.runAllTimers();
        expect(spy).toHaveBeenCalledTimes(1);
    });
    test("should call new callback when one is provided", (): void => {
        const spy: jest.Mock = jest.fn();
        const spy2: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
            })
        );

        rendered.setProps({ callback: spy2 });

        jest.runAllTimers();
        expect(spy).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
    });
    test("should not call timer if component unmounts before delay", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
            })
        );

        rendered.unmount();
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(0);
    });
    test("should not invoke callback if delay is set to null", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
            })
        );
        rendered.setProps({ delay: null });

        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(0);
    });
    test("should not call an additional callback if component renders after callback is called", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
            })
        );
        jest.runAllTimers();
        rendered.update();

        rendered.setProps({ delay: 300 });
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(1);
    });
    test("should reregister delay function after first invocation if new reregister keys are provided", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            React.createElement(UseTimeout as () => JSX.Element, {
                delay: 300,
                callback: spy,
                children: <div>Hello world</div>,
                dependencies: [Symbol()],
            })
        );

        jest.runAllTimers();
        rendered.update();

        rendered.setProps({ dependencies: [Symbol()] });
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(2);
    });
});
