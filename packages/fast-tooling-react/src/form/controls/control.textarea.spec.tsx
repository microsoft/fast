import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TextareaFormControl } from "./control.textarea";
import {
    TextareaFormControlClassNameContract,
    TextareaFormControlProps,
} from "./control.textarea.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: TextareaFormControlClassNameContract = {
    textareaFormControl: "textareaFormControl-class",
    textareaFormControl__disabled: "textareaFormControl__disabled-class",
    textareaFormControl_badge: "textareaFormControl_badge-class",
    textareaFormControl_control: "textareaFormControl_control-class",
    textareaFormControl_controlLabel: "textareaFormControl_controlLabel-class",
    textareaFormControl_controlLabelRegion:
        "textareaFormControl_controlLabelRegion-class",
    textareaFormControl_controlRegion: "textareaFormControl_controlRegion-class",
    textareaFormControl_controlTextarea: "textareaFormControl_controlTextarea-class",
    textareaFormControl_defaultValueIndicator:
        "textareaFormControl_defaultValueIndicator-class",
    textareaFormControl_invalidMessage: "textareaFormControl_invalidMessage-class",
    textareaFormControl_softRemove: "textareaFormControl_softRemove-class",
    textareaFormControl_softRemoveInput: "textareaFormControl_softRemoveInput-class",
};

const textareaProps: TextareaFormControlProps = {
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    invalidMessage: "",
    schema: {},
};

describe("TextareaFormControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <TextareaFormControl {...textareaProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an HTML textarea element", () => {
        const rendered: any = mount(
            <TextareaFormControl {...textareaProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("textarea")).toHaveLength(1);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(
            <TextareaFormControl {...textareaProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML textarea element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(
            <TextareaFormControl {...textareaProps} managedClasses={managedClasses} />
        );
        const label: any = rendered.find("label");
        const textarea: any = rendered.find("textarea");

        expect(label.prop("htmlFor")).toMatch(textarea.prop("id"));
    });
    test("should fire an `onChange` callback when the textarea value is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered.find("textarea").simulate("change", { target: { value: "foo" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual("foo");
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                data={"foo"}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                data={"foo"}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        const wrapper: any = rendered.find("textarea");

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("disabled")).toBeTruthy();
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "foo";
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                data={data}
                onChange={handleChange}
                managedClasses={managedClasses}
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
            <TextareaFormControl
                {...textareaProps}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered
                .find("textarea")
                .at(0)
                .getDOMNode()
                .checkValidity()
        ).toBe(false);
    });
    test("should not be invalid if an invalid message is passed as an empty string", () => {
        const invalidMessage: string = "";
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered
                .find("textarea")
                .at(0)
                .getDOMNode()
                .checkValidity()
        ).toBe(true);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                data={"foo"}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
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
            <TextareaFormControl
                {...textareaProps}
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
            <TextareaFormControl
                {...textareaProps}
                managedClasses={managedClasses}
                data={undefined}
                default={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.textareaFormControl_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                managedClasses={managedClasses}
                data={"foo"}
                default={"bar"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.textareaFormControl_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string = "foo";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                managedClasses={managedClasses}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.textareaFormControl_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: string = "foo";
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                managedClasses={managedClasses}
                data={undefined}
                default={defaultValue}
            />
        );

        expect(
            rendered
                .find("textarea")
                .at(0)
                .prop("value")
        ).toBe(defaultValue);
    });
    test("should not show default values if data exists", () => {
        const value: string = "foo";
        const defaultValue: string = "bar";
        const rendered: any = mount(
            <TextareaFormControl
                {...textareaProps}
                managedClasses={managedClasses}
                data={value}
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
