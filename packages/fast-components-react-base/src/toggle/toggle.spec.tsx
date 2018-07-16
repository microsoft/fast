import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    IToggleClassNameContract,
    IToggleHandledProps,
    IToggleManagedClasses,
    IToggleState,
    IToggleUnhandledProps,
    ToggleProps,
} from "./toggle";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("toggle", (): void => {
    generateSnapshots(examples);
});

describe("toggle unit-tests", (): void => {
    const Component: React.ComponentClass<IToggleHandledProps & IToggleManagedClasses> = examples.component;
    const managedClasses: IToggleClassNameContract = {
        toggle: "toggle-class",
        toggle_label: "toggle-label-class",
        toggle_wrapper: "toggle-wrapper-class",
        toggle_input: "toggle-input-class",
        toggle_button: "toggle-button-class"
    };
    const handledProps: IToggleHandledProps & IToggleManagedClasses = {
        managedClasses,
        id: "id",
        selectedString: "Selected",
        statusLabelId: "statusLabelId",
        unselectedString: "Unselected"
    };

    test("should correctly manage unhandledProps", () => {
        const unhandledProps: IToggleUnhandledProps = {
            "aria-hidden": true
        };
        const props: ToggleProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should correcly operate as an uncontrolled component and set initial state if `selected` prop is not passed", () => {
        const rendered: any = shallow(
            <Component {...handledProps} />
        );

        const state: any = rendered.state("checked");

        expect(state).toBe(undefined);
    });

    test("should correcly operate as an uncontrolled component and handle `onChange` events when `selected` prop is not passed", () => {
        const rendered: any = shallow(
            <Component {...handledProps} />
        );

        expect(rendered.state("checked")).toBe(undefined);

        const input: any = rendered.find(".toggle-input-class");
        input.prop("onChange")(); // we have to fire the internal onChange from the input as we aren't passing one

        expect(rendered.state("checked")).toBe(true);
    });

    test("should correcly operate as a controlled component when `onChange` and `selected` prop is passed", () => {
        const onChange: any = jest.fn();
        const rendered: any = shallow(
            <Component {...handledProps} selected={true} onChange={onChange} />
        );
        const input: any = rendered.find(".toggle-input-class");

        input.simulate("change", { selected: false });

        expect(onChange).toHaveBeenCalled();
    });

    test("should correcly call getDerivedStateFromProps if an updated `selected` prop is passed which differs from the state", () => {
        const rendered: any = shallow(
            <Component {...handledProps} />
        );

        const newProps: Partial<IToggleHandledProps> = {
            selected: true
        };

        expect(rendered.state("checked")).toEqual(undefined);

        rendered.setProps(newProps);

        expect(rendered.state("checked")).toEqual(true);
    });
});
