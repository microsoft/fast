import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { FormItemButton } from "./form-item.button";
import {
    FormItemButtonClassNameContract,
    FormItemButtonProps,
} from "./form-item.button.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemButtonClassNameContract = {
    formItemButton: "formItemButton-class",
    formItemButton__disabled: "formItemButton__disabled-class",
    formItemButton_badge: "formItemButton_badge-class",
    formItemButton_control: "formItemButton_control-class",
    formItemButton_controlInput: "formItemButton_controlInput-class",
    formItemButton_controlLabel: "formItemButton_controlLabel-class",
    formItemButton_controlLabelRegion: "formItemButton_controlLabelRegion-class",
    formItemButton_controlRegion: "formItemButton_controlRegion-class",
    formItemButton_defaultValueIndicator: "formItemButton_defaultValueIndicator-class",
    formItemButton_invalidMessage: "formItemButton_invalidMessage-class",
    formItemButton_softRemove: "formItemButton_softRemove-class",
    formItemButton_softRemoveInput: "formItemButton_softRemoveInput-class",
};

const buttonProps: FormItemButtonProps = {
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

describe("Button", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<FormItemButton {...buttonProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML button element", () => {
        const rendered: any = mount(
            <FormItemButton {...buttonProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("button")).toHaveLength(1);
    });
    test("should generate an HTML label", () => {
        const rendered: any = mount(
            <FormItemButton {...buttonProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find(`.${managedClasses.formItemButton__disabled}`)).toHaveLength(
            1
        );
        expect(
            rendered
                .find(`.${managedClasses.formItemButton_controlInput}`)
                .prop("disabled")
        ).toBeTruthy();
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
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
        const data: null = null;
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
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
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
                invalidMessage={invalidMessage}
            />
        );

        expect(
            rendered
                .find(`.${managedClasses.formItemButton_controlInput}`)
                .getDOMNode()
                .checkValidity()
        ).toBe(false);
    });
    test("should not be invalid if an invalid message is passed as an empty string", () => {
        const invalidMessage: string = "";
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
                invalidMessage={invalidMessage}
            />
        );

        expect(
            rendered
                .find(`.${managedClasses.formItemButton_controlInput}`)
                .getDOMNode()
                .checkValidity()
        ).toBe(true);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `buttonValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
                invalidMessage={invalidMessage}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `buttonValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
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
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
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
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={undefined}
                default={null}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemButton_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={null}
                default={null}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemButton_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the `onChange` callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string = null;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.formItemButton_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: string = "bar";
        const schema: any = {
            const: buttonProps.schema.const,
        };
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={undefined}
                schema={schema}
                default={defaultValue}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemButton_controlInput}`).text()
        ).toBe("Set to null");
    });
    test("should fire the onChange event when the button is clicked", () => {
        const schema: any = {
            const: buttonProps.schema.const,
        };
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemButton
                {...buttonProps}
                managedClasses={managedClasses}
                data={undefined}
                schema={schema}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered.find(`.${managedClasses.formItemButton_controlInput}`).simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][1]).toEqual(null);
    });
});
