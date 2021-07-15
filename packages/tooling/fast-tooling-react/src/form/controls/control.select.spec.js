import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SelectControl } from "./control.select";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const managedClasses = {
    selectControl: "selectControl-class",
    selectControl__disabled: "selectControl__disabled-class",
    selectControl__default: "selectControl__default-class",
    selectControl_input: "selectControl_input-class",
};
const selectProps = {
    type: ControlType.select,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    disabled: false,
    options: [],
    onChange: jest.fn(),
    updateValidity: jest.fn(),
    reportValidity: jest.fn(),
    value: "",
    schema: {},
    elementRef: null,
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
};
describe("SelectControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<SelectControl {...selectProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML select element", () => {
        const rendered = mount(
            <SelectControl {...selectProps} managedClasses={managedClasses} />
        );
        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate an HTML select element when there is only one option and select is optional", () => {
        const rendered = mount(
            <SelectControl
                {...selectProps}
                options={["foo"]}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate HTML options for each passed option", () => {
        const renderedNoOptions = mount(
            <SelectControl {...selectProps} managedClasses={managedClasses} />
        );
        expect(renderedNoOptions.find("option")).toHaveLength(0);
        const renderedOptions = mount(
            <SelectControl
                {...selectProps}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );
        expect(renderedOptions.find("option")).toHaveLength(2);
    });
    test("should fire an `onChange` callback when a different option is selected", () => {
        const handleChange = jest.fn();
        const rendered = mount(
            <SelectControl
                {...selectProps}
                onChange={handleChange}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );
        const selectElement = rendered.find("select");
        selectElement.simulate("change", { target: { value: "bar" } });
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: "bar" });
    });
    test("should fire an `onChange` callback with numbers as values when a different option is selected", () => {
        const handleChange = jest.fn();
        const rendered = mount(
            <SelectControl
                {...selectProps}
                onChange={handleChange}
                options={[1, 2]}
                managedClasses={managedClasses}
            />
        );
        const selectElement = rendered.find("select");
        selectElement.simulate("change", { target: { value: "2" } });
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: 2 });
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered = mount(
            <SelectControl
                {...selectProps}
                disabled={true}
                options={[1, 2]}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find("select")).toHaveLength(1);
        expect(rendered.find("select").prop("disabled")).toBeTruthy();
        expect(rendered.find(`.${managedClasses.selectControl__disabled}`)).toHaveLength(
            1
        );
    });
    test("should have the default class when default prop is passed", () => {
        const rendered = mount(
            <SelectControl
                {...selectProps}
                value={undefined}
                default={"foo"}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find(`.${managedClasses.selectControl__default}`)).toHaveLength(
            1
        );
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue = "foo";
        const rendered = mount(
            <SelectControl
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                value={undefined}
                default={defaultValue}
            />
        );
        expect(rendered.find("select").at(0).prop("value")).toBe(defaultValue);
    });
    test("should not show default values if data exists", () => {
        const value = "foo";
        const defaultValue = "bar";
        const rendered = mount(
            <SelectControl
                {...selectProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(rendered.find("select").at(0).prop("value")).toBe(value);
    });
    test("should reset the value to an empty string if the value and default are undefined", () => {
        const value = "foo";
        const rendered = mount(
            <SelectControl
                {...selectProps}
                managedClasses={managedClasses}
                value={value}
            />
        );
        expect(rendered.find("select").at(0).prop("value")).toBe(value);
        rendered.setProps(
            Object.assign(Object.assign({}, selectProps), {
                managedClasses,
                value: void 0,
            })
        );
        expect(rendered.find("select").at(0).prop("value")).toBe("");
    });
});
