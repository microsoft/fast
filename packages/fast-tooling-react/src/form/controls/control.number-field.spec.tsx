import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { NumberFieldControl } from "./control.number-field";
import { NumberFieldControlProps } from "./control.number-field.props";
import { NumberFieldControlClassNameContract } from "./control.number-field.style";
import { ControlType } from "../templates";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: NumberFieldControlClassNameContract = {
    numberFieldControl: "numberFieldControl-class",
    numberFieldControl__disabled: "numberFieldControl__disabled-class",
    numberFieldControl__default: "numberFieldControl__default-class",
};

const numberFieldProps: NumberFieldControlProps = {
    type: ControlType.numberField,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    onChange: jest.fn(),
    min: 0,
    max: Infinity,
    step: 1,
    value: 0,
    schema: {},
    disabled: false,
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    validationErrors: [],
    required: false,
};

describe("NumberFieldControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <NumberFieldControl
                    {...numberFieldProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered: any = mount(
            <NumberFieldControl {...numberFieldProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <NumberFieldControl
                {...numberFieldProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find("input")).toHaveLength(1);
        expect(rendered.find("input").prop("disabled")).toBeTruthy();
        expect(
            rendered.find(`.${managedClasses.numberFieldControl__disabled}`)
        ).toHaveLength(1);
    });
    test("should have the default class when default prop is passed", () => {
        const rendered: any = mount(
            <NumberFieldControl
                {...numberFieldProps}
                value={undefined}
                default={42}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.numberFieldControl__default}`)
        ).toHaveLength(1);
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <NumberFieldControl
                {...numberFieldProps}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { value: 1 } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: 1 });
    });
    test("should not fire an `onChange` callback if the input is NaN", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <NumberFieldControl
                {...numberFieldProps}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { value: "foo" } });

        expect(handleChange).not.toHaveBeenCalled();
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: number = 5;
        const rendered: any = mount(
            <NumberFieldControl
                {...numberFieldProps}
                managedClasses={managedClasses}
                value={undefined}
                default={defaultValue}
            />
        );

        expect(rendered.find("input").prop("value")).toBe(defaultValue);
    });
    test("should not show default values if data exists", () => {
        const value: number = 5;
        const defaultValue: number = 10;
        const rendered: any = mount(
            <NumberFieldControl
                {...numberFieldProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("value")
        ).toBe(value);
    });
});
