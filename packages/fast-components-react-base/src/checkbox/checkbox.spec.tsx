import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    CheckboxProps,
    ICheckboxClassNameContract,
    ICheckboxHandledProps,
    ICheckboxManagedClasses,
    ICheckboxState,
    ICheckboxUnhandledProps
} from "./checkbox";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("checkbox", (): void => {
    generateSnapshots(examples);
});

describe("checkbox unit-tests", (): void => {
    const Component: React.ComponentClass<ICheckboxHandledProps & ICheckboxManagedClasses> = examples.component;
    const managedClasses: ICheckboxClassNameContract = {
        checkbox: "checkbox-class",
        checkbox_disabled: "disabled-class",
        checkbox_input: "input-class",
        checkbox_label: "label-class",
        checkbox_span: "span-class",
    };

    test("should correctly manage unhandledProps", () => {
        const handledProps: ICheckboxHandledProps & ICheckboxManagedClasses = {
            managedClasses
        };

        const unhandledProps: ICheckboxUnhandledProps = {
            "aria-hidden": true
        };

        const props: CheckboxProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should correctly manage the disabled prop by adding a class and passing `disabled` to the input element", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.hasClass("disabled-class")).toBe(true);
        expect(rendered.find(".input-class[disabled]")).not.toBe(undefined);
        expect(rendered.find(".input-class[disabled]").prop("disabled")).toBe(true);
    });

    test("should correcly operate as an uncontrolled component and set initial state if `checked` prop is not passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        const state: any = rendered.state("checked");

        expect(state).toBe(false);
    });

    test("should correcly operate as an uncontrolled component and handle `onChange` events when `onChange` prop is not passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        expect(rendered.state("checked")).toBe(false);

        const input: any = rendered.find(".input-class");
        input.prop("onChange")(); // we have to fire the internal onChange from the input as we aren't passing one

        expect(rendered.state("checked")).toBe(true);
    });

    test("should correcly operate as a controlled component when `onChange` and `checked` prop is passed", () => {
        const onChange: any = jest.fn();
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} checked={true} onChange={onChange} />
        );
        const input: any = rendered.find("input");

        input.simulate("change", { checked: false });

        expect(onChange).toHaveBeenCalled();
    });

    test("should correcly call getDerivedStateFromProps if an updated `checked` prop is passed which differs from the state", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        const newProps: Partial<ICheckboxHandledProps> = {
            checked: true
        };

        expect(rendered.state("checked")).toEqual(false);

        rendered.setProps(newProps);

        expect(rendered.state("checked")).toEqual(true);
    });
});
