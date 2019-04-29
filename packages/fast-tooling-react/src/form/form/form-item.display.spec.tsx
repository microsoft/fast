import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { FormItemDisplay } from "./form-item.display";
import {
    FormItemDisplayClassNameContract,
    FormItemDisplayProps,
} from "./form-item.display.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemDisplayClassNameContract = {
    formItemDisplay: "formItemDisplay-class",
    formItemDisplay__disabled: "formItemDisplay__disabled-class",
    formItemDisplay_badge: "formItemDisplay_badge-class",
    formItemDisplay_control: "formItemDisplay_control-class",
    formItemDisplay_controlInput: "formItemDisplay_controlInput-class",
    formItemDisplay_controlLabel: "formItemDisplay_controlLabel-class",
    formItemDisplay_controlLabelRegion: "formItemDisplay_controlLabelRegion-class",
    formItemDisplay_controlRegion: "formItemDisplay_controlRegion-class",
    formItemDisplay_constValueIndicator: "formItemDisplay_constValueIndicator-class",
    formItemDisplay_defaultValueIndicator: "formItemDisplay_defaultValueIndicator-class",
    formItemDisplay_invalidMessage: "formItemDisplay_invalidMessage-class",
    formItemDisplay_softRemove: "formItemDisplay_softRemove-class",
    formItemDisplay_softRemoveInput: "formItemDisplay_softRemoveInput-class",
};

const displayProps: FormItemDisplayProps = {
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    invalidMessage: "",
    schema: {
        const: "foo",
    },
};

describe("Display", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <FormItemDisplay {...displayProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered: any = mount(
            <FormItemDisplay {...displayProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should generate an HTML label", () => {
        const rendered: any = mount(
            <FormItemDisplay {...displayProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should fire an `onChange` callback when the const indicator has been clicked and a const value is available", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        const inputElement: any = rendered.find("button");

        inputElement.simulate("click");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual("");
        expect(handleChange.mock.calls[0][1]).toEqual("foo");
    });
    test("should fire an `onChange` callback when the const indicator has been clicked and a single enum value is available", () => {
        const handleChange: any = jest.fn();
        const enumValue: string = "bar";
        const schema: any = {
            enum: [enumValue],
        };

        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                onChange={handleChange}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        const inputElement: any = rendered.find("button");

        inputElement.simulate("click");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual("");
        expect(handleChange.mock.calls[0][1]).toEqual(enumValue);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("input")).toHaveLength(2);
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("disabled")
        ).toBeTruthy();
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
                onChange={handleChange}
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
        const data: string = "foo";
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={data}
                onChange={handleChange}
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
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
                invalidMessage={invalidMessage}
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
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
                invalidMessage={invalidMessage}
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
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
                invalidMessage={invalidMessage}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
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
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
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
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={undefined}
                default={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemDisplay_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={"foo"}
                default={"bar"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemDisplay_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the `onChange` callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string = "foo";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.formItemDisplay_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: string = "bar";
        const schema: any = {
            const: displayProps.schema.const,
            default: defaultValue,
        };
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
                managedClasses={managedClasses}
                data={undefined}
                schema={schema}
            />
        );

        expect(
            rendered
                .find("input")
                .at(0)
                .prop("value")
        ).toBe(`\"${defaultValue}\"`);
    });
    test("should not show default values if data exists", () => {
        const value: string = "foo";
        const defaultValue: string = "bar";
        const rendered: any = mount(
            <FormItemDisplay
                {...displayProps}
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
        ).toBe(`\"${value}\"`);
    });
});
