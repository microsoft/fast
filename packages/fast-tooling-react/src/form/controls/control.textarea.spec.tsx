import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TextareaControl } from "./control.textarea";
import { TextareaControlProps } from "./control.textarea.props";
import { TextareaControlClassNameContract } from "./control.textarea.style";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: TextareaControlClassNameContract = {
    textareaControl: "textareaFormControl-class",
    textareaControl__disabled: "textareaControl__disabled-class",
};

const textareaProps: TextareaControlProps = {
    dataLocation: "",
    onChange: jest.fn(),
    value: "",
    schema: {},
    disabled: false,
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
};

describe("TextareaControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <TextareaControl {...textareaProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an HTML textarea element", () => {
        const rendered: any = mount(
            <TextareaControl {...textareaProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("textarea")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <TextareaControl
                {...textareaProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("textarea")).toHaveLength(1);
        expect(rendered.find("textarea").prop("disabled")).toBeTruthy();
        expect(
            rendered.find(`.${managedClasses.textareaControl__disabled}`)
        ).toHaveLength(1);
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <TextareaControl
                {...textareaProps}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("textarea")
            .at(0)
            .simulate("change", { target: { value: 1 } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: 1 });
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: string = "foo";
        const rendered: any = mount(
            <TextareaControl
                {...textareaProps}
                managedClasses={managedClasses}
                value={undefined}
                default={defaultValue}
            />
        );

        expect(rendered.find("textarea").prop("value")).toBe(defaultValue);
    });
    test("should not show default values if data exists", () => {
        const value: string = "foo";
        const defaultValue: string = "bar";
        const rendered: any = mount(
            <TextareaControl
                {...textareaProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(
            rendered
                .find("textarea")
                .at(0)
                .prop("value")
        ).toBe(value);
    });
});
