import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TextareaControl } from "./control.textarea";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const managedClasses = {
    textareaControl: "textareaFormControl-class",
    textareaControl__disabled: "textareaControl__disabled-class",
    textareaControl__default: "textareaControl__default-class",
};
const textareaProps = {
    type: ControlType.textarea,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    onChange: jest.fn(),
    value: "",
    schema: {},
    disabled: false,
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
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
        const rendered = mount(
            <TextareaControl {...textareaProps} managedClasses={managedClasses} />
        );
        expect(rendered.find("textarea")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered = mount(
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
    test("should have the default class when default prop is passed", () => {
        const rendered = mount(
            <TextareaControl
                {...textareaProps}
                value={undefined}
                default={"foo"}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find(`.${managedClasses.textareaControl__default}`)).toHaveLength(
            1
        );
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange = jest.fn();
        const rendered = mount(
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
        const defaultValue = "foo";
        const rendered = mount(
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
        const value = "foo";
        const defaultValue = "bar";
        const rendered = mount(
            <TextareaControl
                {...textareaProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(rendered.find("textarea").at(0).prop("value")).toBe(value);
    });
    test("should show value if value is empty string", () => {
        const value = "";
        const defaultValue = "bar";
        const rendered = mount(
            <TextareaControl
                {...textareaProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(rendered.find("textarea").at(0).prop("value")).toBe(value);
    });
    test("should show default if value is undefined and default is an empty string", () => {
        const value = void 0;
        const defaultValue = "";
        const rendered = mount(
            <TextareaControl
                {...textareaProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(rendered.find("textarea").at(0).prop("value")).toBe(defaultValue);
    });
    test("should show empty string if value or default is not provided", () => {
        const value = void 0;
        const defaultValue = void 0;
        const emptyString = "";
        const rendered = mount(
            <TextareaControl
                {...textareaProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(rendered.find("textarea").at(0).prop("value")).toBe(emptyString);
    });
});
