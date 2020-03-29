import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { CheckboxControl } from "./control.checkbox";
import { CheckboxControlProps } from "./control.checkbox.props";
import { CheckboxControlClassNameContract } from "./control.checkbox.style";
import { ControlType } from "../templates";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: CheckboxControlClassNameContract = {
    checkboxControl: "checkboxControl-class",
    checkboxControl__disabled: "checkboxControl__disabled-class",
    checkboxControl__default: "checkboxControl__default-class",
};

const checkboxProps: CheckboxControlProps = {
    type: ControlType.checkbox,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    onChange: jest.fn(),
    value: false,
    schema: {},
    disabled: false,
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    validationErrors: [],
    required: false,
    messageSystem: void 0,
};

describe("CheckboxControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <CheckboxControl {...checkboxProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an input HTML element", () => {
        const rendered: any = mount(
            <CheckboxControl {...checkboxProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element", () => {
        const dataLocation: string = "foo";
        const rendered: any = mount(
            <CheckboxControl
                {...checkboxProps}
                dataLocation={dataLocation}
                managedClasses={managedClasses}
            />
        );
        const input: any = rendered.find("input");

        expect(dataLocation).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <CheckboxControl
                {...checkboxProps}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { checked: true } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: true });
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <CheckboxControl
                {...checkboxProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        const wrapper: any = rendered.find("div");
        const input: any = rendered.find("input");

        expect(input).toHaveLength(1);
        expect(input.prop("disabled")).toBeTruthy();
        expect(wrapper.find(`.${managedClasses.checkboxControl__disabled}`)).toHaveLength(
            1
        );
    });
    test("should have the default class when default prop is passed", () => {
        const rendered: any = mount(
            <CheckboxControl
                {...checkboxProps}
                value={undefined}
                default={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find(`.${managedClasses.checkboxControl__default}`)).toHaveLength(
            1
        );
    });
    test("should show default values if they exist and no data is available", () => {
        const rendered: any = mount(
            <CheckboxControl
                {...checkboxProps}
                managedClasses={managedClasses}
                value={undefined}
                default={true}
            />
        );

        expect(
            rendered
                .find("input")
                .at(0)
                .prop("value")
        ).toBe(true.toString());
    });
    test("should not show default values if data exists", () => {
        const rendered: any = mount(
            <CheckboxControl
                {...checkboxProps}
                managedClasses={managedClasses}
                value={false}
                default={true}
            />
        );
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("value")
        ).toBe(false.toString());
    });
});
