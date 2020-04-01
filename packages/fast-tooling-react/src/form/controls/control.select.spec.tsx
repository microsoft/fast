import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SelectControl } from "./control.select";
import { SelectControlProps } from "./control.select.props";
import { SelectControlClassNameContract } from "./control.select.style";
import { ControlType } from "../templates";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: SelectControlClassNameContract = {
    selectControl: "selectControl-class",
    selectControl__disabled: "selectControl__disabled-class",
    selectControl__default: "selectControl__default-class",
    selectControl_input: "selectControl_input-class",
};

const selectProps: SelectControlProps = {
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
};

describe("SelectControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<SelectControl {...selectProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML select element", () => {
        const rendered: any = mount(
            <SelectControl {...selectProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate an HTML select element when there is only one option and select is optional", () => {
        const rendered: any = mount(
            <SelectControl
                {...selectProps}
                options={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate HTML options for each passed option", () => {
        const renderedNoOptions: any = mount(
            <SelectControl {...selectProps} managedClasses={managedClasses} />
        );

        expect(renderedNoOptions.find("option")).toHaveLength(0);

        const renderedOptions: any = mount(
            <SelectControl
                {...selectProps}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        expect(renderedOptions.find("option")).toHaveLength(2);
    });
    test("should fire an `onChange` callback when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <SelectControl
                {...selectProps}
                onChange={handleChange}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        const selectElement: any = rendered.find("select");

        selectElement.simulate("change", { target: { value: "bar" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: "bar" });
    });
    test("should fire an `onChange` callback with numbers as values when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <SelectControl
                {...selectProps}
                onChange={handleChange}
                options={[1, 2]}
                managedClasses={managedClasses}
            />
        );

        const selectElement: any = rendered.find("select");

        selectElement.simulate("change", { target: { value: "2" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: 2 });
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
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
        const rendered: any = mount(
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
        const defaultValue: string = "foo";
        const rendered: any = mount(
            <SelectControl
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                value={undefined}
                default={defaultValue}
            />
        );

        expect(
            rendered
                .find("select")
                .at(0)
                .prop("value")
        ).toBe(defaultValue);
    });
    test("should not show default values if data exists", () => {
        const value: string = "foo";
        const defaultValue: string = "bar";
        const rendered: any = mount(
            <SelectControl
                {...selectProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(
            rendered
                .find("select")
                .at(0)
                .prop("value")
        ).toBe(value);
    });
    test("should reset the value to an empty string if the value and default are undefined", () => {
        const value: string = "foo";
        const rendered: any = mount(
            <SelectControl
                {...selectProps}
                managedClasses={managedClasses}
                value={value}
            />
        );
        expect(
            rendered
                .find("select")
                .at(0)
                .prop("value")
        ).toBe(value);

        rendered.setProps({
            ...selectProps,
            managedClasses,
            value: void 0,
        });

        expect(
            rendered
                .find("select")
                .at(0)
                .prop("value")
        ).toBe("");
    });
});
