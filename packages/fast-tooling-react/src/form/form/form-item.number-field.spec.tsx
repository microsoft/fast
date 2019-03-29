import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import FormItemCommon from "./form-item.props";
import { FormItemNumberField } from "./form-item.number-field";
import { FormItemNumberFieldClassNameContract } from "./form-item.number-field.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemNumberFieldClassNameContract = {
    formItemNumberField: "formItemNumberField-class",
    formItemNumberField__disabled: "formItemNumberField__disabled-class",
    formItemNumberField_badge: "formItemNumberField_badge-class",
    formItemNumberField_control: "formItemNumberField_control-class",
    formItemNumberField_controlInput: "formItemNumberField_controlInput-class",
    formItemNumberField_controlLabel: "formItemNumberField_controlLabel-class",
    formItemNumberField_controlLabelRegion:
        "formItemNumberField_controlLabelRegion-class",
    formItemNumberField_controlRegion: "formItemNumberField_controlRegion-class",
    formItemNumberField_defaultValueIndicator:
        "formItemNumberField_defaultValueIndicator-class",
    formItemNumberField_invalidMessage: "formItemNumberField_invalidMessage-class",
    formItemNumberField_softRemove: "formItemNumberField_softRemove-class",
    formItemNumberField_softRemoveInput: "formItemNumberField_softRemoveInput-class",
};

const numberFieldProps: FormItemCommon = {
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    invalidMessage: "",
};

describe("NumberField", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <FormItemNumberField
                    {...numberFieldProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered: any = mount(
            <FormItemNumberField {...numberFieldProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(
            <FormItemNumberField {...numberFieldProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find("input")).toHaveLength(2);
        expect(
            rendered
                .find("input")
                .first()
                .prop("disabled")
        ).toBeTruthy();
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(
            <FormItemNumberField {...numberFieldProps} managedClasses={managedClasses} />
        );
        const input: any = rendered.find("input").at(0);
        const label: any = rendered.find("label");

        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemNumberField
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
        expect(handleChange.mock.calls[0][1]).toEqual(1);
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
                data={10}
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
        const data: number = 10;
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
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
            <FormItemNumberField
                {...numberFieldProps}
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
            <FormItemNumberField
                {...numberFieldProps}
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
            <FormItemNumberField
                {...numberFieldProps}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
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
            <FormItemNumberField
                {...numberFieldProps}
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
            <FormItemNumberField
                {...numberFieldProps}
                managedClasses={managedClasses}
                data={undefined}
                default={5}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemNumberField_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
                managedClasses={managedClasses}
                data={10}
                default={5}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemNumberField_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: number = 5;
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
                managedClasses={managedClasses}
                data={undefined}
                default={defaultValue}
            />
        );

        expect(
            rendered
                .find("input")
                .at(0)
                .prop("value")
        ).toBe(defaultValue.toString());
    });
    test("should not show default values if data exists", () => {
        const value: number = 5;
        const defaultValue: number = 10;
        const rendered: any = mount(
            <FormItemNumberField
                {...numberFieldProps}
                managedClasses={managedClasses}
                data={value}
                default={defaultValue}
            />
        );
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("value")
        ).toBe(value.toString());
    });
});
