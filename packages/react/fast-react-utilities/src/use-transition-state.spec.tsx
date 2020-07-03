import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { act } from "react-dom/test-utils";
import { configure, mount, ReactWrapper } from "enzyme";
import {
    getTransitionState,
    TransitionStates,
    UseTransitionState,
    UseTransitionStateProps,
} from "./use-transition-state";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

/**
 * Mock timers
 */
jest.useFakeTimers();

function render(state: TransitionStates): JSX.Element {
    return <div>{state}</div>;
}

describe("useTransitionState", (): void => {
    test("should return 'inactive' state when initialized with a falsey value", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: 300,
                    active: false,
                    children: render,
                }
            )
        );

        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());
    });

    test("should return 'inactive' state when initialized with a falsey value", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: 300,
                    active: false,
                    children: render,
                }
            )
        );

        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());
    });

    test("should return 'active' state when initialized with a falsey value", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: 300,
                    active: true,
                    children: render,
                }
            )
        );

        expect(rendered.find("div").text()).toBe(TransitionStates.active.toString());
    });

    test("should return an 'active' state when initialized with a truthy value", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: 300,
                    active: false,
                    children: render,
                }
            )
        );

        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());
        act(() => jest.runAllTimers());

        rendered.setProps({ active: true });
        expect(rendered.find("div").text()).toBe(TransitionStates.activating.toString());

        act(() => jest.runAllTimers());
        expect(rendered.find("div").text()).toBe(TransitionStates.active.toString());
    });

    test("should move from a 'from' state to a 'active' state when value goes from false -> true", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: 300,
                    active: false,
                    children: render,
                }
            )
        );

        act(() => jest.runAllTimers());
        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());

        rendered.setProps({ active: true });
        expect(rendered.find("div").text()).toBe(TransitionStates.activating.toString());

        act(() => jest.runAllTimers());
        expect(rendered.find("div").text()).toBe(TransitionStates.active.toString());
    });

    test("should move from a 'active' state to a 'inactive' state when value goes from true -> false", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: 300,
                    active: true,
                    children: render,
                }
            )
        );

        act(() => jest.runAllTimers());
        expect(rendered.find("div").text()).toBe(TransitionStates.active.toString());

        rendered.setProps({ active: false });

        expect(rendered.find("div").text()).toBe(
            TransitionStates.deactivating.toString()
        );
        act(() => jest.runAllTimers());
        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());
    });

    test("should use first duration for 'inactive' -> 'active' and second duration for 'active' -> 'inactive'", (): void => {
        const rendered: ReactWrapper = mount(
            React.createElement(
                UseTransitionState as (props: UseTransitionStateProps) => JSX.Element,
                {
                    duration: [1000, 500],
                    active: false,
                    children: render,
                }
            )
        );

        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());
        rendered.setProps({ active: true });
        expect(rendered.find("div").text()).toBe(TransitionStates.activating.toString());

        act(() => jest.advanceTimersByTime(1000));
        expect(rendered.find("div").text()).toBe(TransitionStates.active.toString());

        rendered.setProps({ active: false });
        expect(rendered.find("div").text()).toBe(
            TransitionStates.deactivating.toString()
        );

        act(() => jest.advanceTimersByTime(500));
        expect(rendered.find("div").text()).toBe(TransitionStates.inactive.toString());
    });
});

describe("getTransitionState", (): void => {
    test("should return 'inactive' if both current and previous values are false", (): void => {
        expect(getTransitionState(false, false)).toBe(TransitionStates.inactive);
    });
    test("should return 'active' if both current and previous values are true", (): void => {
        expect(getTransitionState(true, true)).toBe(TransitionStates.active);
    });
    test("should return 'activating' if the previous value is false and current value is true", (): void => {
        expect(getTransitionState(false, true)).toBe(TransitionStates.activating);
    });
    test("should return 'deactiving' if the previous value is true and current value is false", (): void => {
        expect(getTransitionState(true, false)).toBe(TransitionStates.deactivating);
    });
});
