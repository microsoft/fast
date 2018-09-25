import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Checkbox, {
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

describe("checkbox snapshot", (): void => {
    generateSnapshots(examples);
});

describe("checkbox", (): void => {
    const managedClasses: ICheckboxClassNameContract = {
        checkbox: "checkbox-class",
        checkbox_disabled: "disabled-class",
        checkbox_input: "input-class",
        checkbox_label: "label-class",
        checkbox_span: "span-class",
    };

    const inputSelector: string = `.${managedClasses.checkbox_input}`;

    test("should have a displayName that matches the component name", () => {
        expect((Checkbox as any).name).toBe(Checkbox.displayName);
    });

    test("should implement unhandledProps", () => {
        const handledProps: ICheckboxHandledProps & ICheckboxManagedClasses = {
            managedClasses
        };

        const unhandledProps: ICheckboxUnhandledProps = {
            "data-my-custom-attribute": true
        };

        const props: CheckboxProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Checkbox {...props} />
        );

        expect(rendered.first().prop("data-my-custom-attribute")).toEqual(true);
    });

    test("should add a class and `disabled` attribute to the input element when the disabled prop is true", () => {
        const rendered: any = shallow(
            <Checkbox managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.hasClass("disabled-class")).toBe(true);
        expect(rendered.find(".input-class[disabled]")).not.toBe(undefined);
        expect(rendered.find(".input-class[disabled]").prop("disabled")).toBe(true);
    });

    test("should initialize as unchecked if the `checked` prop is not provided", () => {
        expect(
            shallow(<Checkbox managedClasses={managedClasses} />)
            .state("checked")
        ).toBe(false);
    });

    test("should allow a change event to update the checked state when no `checked` prop is provided", () => {
        const rendered: any = shallow(
            <Checkbox managedClasses={managedClasses} />
        );

        expect(rendered.state("checked")).toBe(false);

        rendered.find(inputSelector).simulate("change");

        expect(rendered.state("checked")).toBe(true);
    });

    test("should call a registerd callback after a change event", () => {
        const onChange: any = jest.fn();
        const controlled: any = shallow(
            <Checkbox managedClasses={managedClasses} checked={true} onChange={onChange} />
        );
        const uncontrolled: any = shallow(
            <Checkbox managedClasses={managedClasses} onChange={onChange} />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("should not allow a change event to update the checked state if props.checked is provided", () => {
        const rendered: any = shallow(
            <Checkbox managedClasses={managedClasses} checked={false} />
        );

        expect(rendered.state("checked")).toEqual(false);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("checked")).toEqual(false);

        rendered.setProps({checked: true});
        expect(rendered.state("checked")).toEqual(true);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("checked")).toEqual(true);
    });
});
