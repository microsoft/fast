import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { FormItemSelect } from "./form-item.select";
import {
    FormItemSelectClassNameContract,
    FormItemSelectProps,
} from "./form-item.select.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemSelectClassNameContract = {
    formItemSelect: "formItemSelect-class",
    formItemSelect__disabled: "formItemSelect__disabled-class",
    formItemSelect_badge: "formItemSelect_badge-class",
    formItemSelect_control: "formItemSelect_control-class",
    formItemSelect_controlInput: "formItemSelect_controlInput-class",
    formItemSelect_controlLabel: "formItemSelect_controlLabel-class",
    formItemSelect_controlLabelRegion: "formItemSelect_controlLabelRegion-class",
    formItemSelect_controlRegion: "formItemSelect_controlRegion-class",
    formItemSelect_controlSpan: "formItemSelect_controlSpan-class",
    formItemSelect_defaultValueIndicator: "formItemSelect_defaultValueIndicator-class",
    formItemSelect_invalidMessage: "formItemSelect_invalidMessage-class",
    formItemSelect_softRemove: "formItemSelect_softRemove-class",
    formItemSelect_softRemoveInput: "formItemSelect_softRemoveInput-class",
};

const selectProps: FormItemSelectProps = {
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    options: [],
    onChange: jest.fn(),
    invalidMessage: "",
    schema: {},
};

describe("Select", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<FormItemSelect {...selectProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML select element", () => {
        const rendered: any = mount(
            <FormItemSelect {...selectProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should not generate an HTML select element when there is only one option and select is required", () => {
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                options={["foo"]}
                required={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("select")).toHaveLength(0);
    });
    test("should generate an HTML select element when there is only one option and select is optional", () => {
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                options={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate HTML options for each passed option", () => {
        const renderedNoOptions: any = mount(
            <FormItemSelect {...selectProps} managedClasses={managedClasses} />
        );

        expect(renderedNoOptions.find("option")).toHaveLength(0);

        const renderedOptions: any = mount(
            <FormItemSelect
                {...selectProps}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        expect(renderedOptions.find("option")).toHaveLength(2);
    });
    test("should generate an HTML label", () => {
        const rendered: any = mount(
            <FormItemSelect {...selectProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should fire an `onChange` callback when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                onChange={handleChange}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        const selectElement: any = rendered.find("select");

        selectElement.simulate("change", { target: { value: "bar" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual("");
        expect(handleChange.mock.calls[0][1]).toEqual("bar");
    });
    test("should fire an `onChange` callback with numbers as values when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                onChange={handleChange}
                options={[1, 2]}
                managedClasses={managedClasses}
            />
        );

        const selectElement: any = rendered.find("select");

        selectElement.simulate("change", { target: { value: 2 } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual("");
        expect(handleChange.mock.calls[0][1]).toEqual(2);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                disabled={true}
                options={[1, 2]}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("select")).toHaveLength(1);
        expect(rendered.find("select").prop("disabled")).toBeTruthy();
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={"foo"}
                options={["foo", "bar"]}
                onChange={handleChange}
            />
        );

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "foo";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={data}
                options={["foo", "bar"]}
                onChange={handleChange}
            />
        );

        rendered.find("input").simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
    test("should be invalid if an invalid message is passed", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={"foo"}
                options={["foo", "bar"]}
                invalidMessage={invalidMessage}
            />
        );

        expect(
            rendered
                .find("select")
                .at(0)
                .getDOMNode()
                .checkValidity()
        ).toBe(false);
    });
    test("should not be invalid if an invalid message is passed as an empty string", () => {
        const invalidMessage: string = "";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={"foo"}
                options={["foo", "bar"]}
                invalidMessage={invalidMessage}
            />
        );

        expect(
            rendered
                .find("select")
                .at(0)
                .getDOMNode()
                .checkValidity()
        ).toBe(true);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={"foo"}
                options={["foo", "bar"]}
                invalidMessage={invalidMessage}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={"foo"}
                options={["foo", "bar"]}
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
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={"foo"}
                options={["foo", "bar"]}
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
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                data={undefined}
                default={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemSelect_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                data={"foo"}
                default={"bar"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemSelect_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: string = "foo";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                data={undefined}
                default={defaultValue}
            />
        );

        expect(
            rendered
                .find("select")
                .at(0)
                .prop("value")
        ).toBe(`\"${defaultValue}\"`);
    });
    test("should not show default values if data exists", () => {
        const value: string = "foo";
        const defaultValue: string = "bar";
        const rendered: any = mount(
            <FormItemSelect
                {...selectProps}
                managedClasses={managedClasses}
                data={value}
                default={defaultValue}
            />
        );
        expect(
            rendered
                .find("select")
                .at(0)
                .prop("value")
        ).toBe(`\"${value}\"`);
    });
});
