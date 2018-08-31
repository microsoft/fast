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

describe("toggle snapshot", (): void => {
    generateSnapshots(examples);
});

describe("toggle", (): void => {
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
    const inputSelector: string = `.${managedClasses.toggle_input}`;

    test("should implement unhandledProps", () => {
        const unhandledProps: IToggleUnhandledProps = {
            "data-my-custom-attribute": true
        };
        const props: ToggleProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.first().prop("data-my-custom-attribute")).toBe(true);
    });

    test("should initalize as unselected if the `selected` prop is not provided", () => {
        const rendered: any = shallow(
            <Component {...handledProps} />
        );

        expect(rendered.state("selected")).toBe(false);
    });

    test("a change event should change the selected state when no `selected` prop is not provided", () => {
        const rendered: any = shallow(
            <Component {...handledProps} />
        );

        expect(rendered.state("selected")).toBe(false);

        rendered.find(inputSelector).simulate("change");

        expect(rendered.state("selected")).toBe(true);
    });

    test("should call a regestired callback after a change event", () => {
        const onChange: any = jest.fn();
        const uncontrolled: any = shallow(
            <Component {...handledProps} onChange={onChange} />
        );
        const controlled: any = shallow(
            <Component {...handledProps} selected={true} onChange={onChange} />
        );

        uncontrolled
            .find(inputSelector)
            .simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        controlled
            .find(inputSelector)
            .simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("setting props.selected should prevent Toggle from updating its own selected state", () => {
        const rendered: any = shallow(
            <Component {...handledProps} selected={false} />
        );

        expect(rendered.state("selected")).toEqual(false);
        rendered
            .find(inputSelector)
            .simulate("change");

        expect(rendered.state("selected")).toEqual(false);

        rendered.setProps({selected: true});

        expect(rendered.state("selected")).toEqual(true);
        rendered
            .find(inputSelector)
            .simulate("change");
        expect(rendered.state("selected")).toEqual(true);
    });
});
