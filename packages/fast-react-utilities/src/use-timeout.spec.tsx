import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import { useTimeout } from "./use-timeout";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

/**
 * Mock timers
 */
jest.useFakeTimers();

function UseTimeout(props: {
    timeout: number | null;
    callback: () => any;
    memoKeys?: any[];
}): JSX.Element {
    useTimeout(props.callback, props.timeout, props.memoKeys);

    return <div />;
}

describe("use-timeout", (): void => {
    test("should throw if the provided callback is not a function", (): void => {
        const rendered: ReactWrapper = mount(
            <UseTimeout timeout={300} callback={null} />
        );

        expect(() => {
            jest.runAllTimers();
        }).toThrow();
    });

    test("should call a callback after the provided period of time", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(<UseTimeout timeout={300} callback={spy} />);

        jest.runAllTimers();
        expect(spy).toHaveBeenCalledTimes(1);
    });
    test("should provided callback when delay is changed", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(<UseTimeout timeout={300} callback={spy} />);

        rendered.setProps({ delay: 200 });

        jest.runAllTimers();
        expect(spy).toHaveBeenCalledTimes(1);
    });
    test("should call new callback when one is provided", (): void => {
        const spy: jest.Mock = jest.fn();
        const spy2: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(<UseTimeout timeout={300} callback={spy} />);

        rendered.setProps({ callback: spy2 });

        jest.runAllTimers();
        expect(spy).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
    });
    test("should not call timer if component unmounts before timeout", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(<UseTimeout timeout={300} callback={spy} />);

        rendered.unmount();
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(0);
    });
    test("should not invoke callback if timeout is set to null", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(<UseTimeout timeout={300} callback={spy} />);
        rendered.setProps({ timeout: null });

        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(0);
    });
    test("should not call an additional callback if component renders after callback is called", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(<UseTimeout timeout={300} callback={spy} />);
        jest.runAllTimers();
        rendered.update();

        rendered.setProps({ timeout: 300 });
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(1);
    });
    test("should reregister timeout function after first invocation if new reregister keys are provided", (): void => {
        const spy: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            <UseTimeout timeout={300} callback={spy} memoKeys={[Symbol()]} />
        );
        jest.runAllTimers();
        rendered.update();

        rendered.setProps({ reregister: [Symbol()] });
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(2);
    });
});
