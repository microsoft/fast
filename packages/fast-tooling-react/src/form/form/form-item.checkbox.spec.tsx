import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { FormItemCheckbox } from "./form-item.checkbox";
import {
    FormItemCheckboxClassNameContract,
    FormItemCheckboxProps,
} from "./form-item.checkbox.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemCheckboxClassNameContract = {
    formItemCheckbox: "formItemCheckbox-class",
    formItemCheckbox__disabled: "formItemCheckbox__disabled-class",
    formItemCheckbox_badge: "formItemCheckbox_badge-class",
    formItemCheckbox_control: "formItemCheckbox_control-class",
    formItemCheckbox_input: "formItemCheckbox_input-class",
    formItemCheckbox_invalidMessage: "formItemCheckbox_invalidMessage-class",
    formItemCheckbox_label: "formItemCheckbox_label-class",
    formItemCheckbox_softRemove: "formItemCheckbox_softRemove-class",
    formItemCheckbox_softRemoveInput: "formItemCheckbox_softRemoveInput-class",
    formItemCheckbox_defaultValueIndicator:
        "formItemCheckbox_defaultValueIndicator-class",
};

const checkboxProps: FormItemCheckboxProps = {
    index: 1,
    dataLocation: "",
    data: false,
    required: false,
    label: "",
    onChange: jest.fn(),
    invalidMessage: "",
    schema: {},
};

describe("Checkbox", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <FormItemCheckbox {...checkboxProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an input HTML element", () => {
        const rendered: any = mount(
            <FormItemCheckbox {...checkboxProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should generate a label HTML element", () => {
        const rendered: any = mount(
            <FormItemCheckbox {...checkboxProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(
            <FormItemCheckbox {...checkboxProps} managedClasses={managedClasses} />
        );
        const input: any = rendered.find("input").at(0);
        const label: any = rendered.find("label");

        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemCheckbox
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
        expect(handleChange.mock.calls[0][1]).toEqual(true);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        const input: any = rendered.find("input");

        expect(rendered).toHaveLength(1);
        expect(rendered.prop("disabled")).toBeTruthy();
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                data={true}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(1)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: boolean = true;
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                data={data}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(1)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find("input")
            .at(1)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
    test("should be invalid if an invalid message is passed", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered
                .find("input")
                .at(0)
                .getDOMNode()
                .checkValidity()
        ).toBe(false);
    });
    test("should not be invalid if an invalid message is passed as an empty string", () => {
        const invalidMessage: string = "";
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered
                .find("input")
                .at(0)
                .getDOMNode()
                .checkValidity()
        ).toBe(true);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                managedClasses={managedClasses}
                invalidMessage={invalidMessage}
                displayValidationInline={true}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(true);
    });
    test("should update an invalid message if the invalid message is updated", () => {
        const invalidMessage1: string = "Foo";
        const invalidMessage2: string = "Bar";
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                managedClasses={managedClasses}
                invalidMessage={invalidMessage1}
                displayValidationInline={true}
            />
        );

        expect(rendered.html().includes(invalidMessage1)).toBe(true);

        rendered.setProps({ invalidMessage: invalidMessage2 });

        expect(rendered.html().includes(invalidMessage2)).toBe(true);
    });
    test("should show a default indicator if default values exist and no data is available", () => {
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                managedClasses={managedClasses}
                data={undefined}
                default={true}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemCheckbox_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                managedClasses={managedClasses}
                data={false}
                default={true}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemCheckbox_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: boolean = true;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                onChange={callback}
                managedClasses={managedClasses}
                default={defaultValue}
                data={undefined}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.formItemCheckbox_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
    test("should show default values if they exist and no data is available", () => {
        const rendered: any = mount(
            <FormItemCheckbox
                {...checkboxProps}
                managedClasses={managedClasses}
                data={undefined}
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
            <FormItemCheckbox
                {...checkboxProps}
                managedClasses={managedClasses}
                data={false}
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
