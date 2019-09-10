import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SelectFormControl } from "./control.select";
import {
    SelectFormControlClassNameContract,
    SelectFormControlProps,
} from "./control.select.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: SelectFormControlClassNameContract = {
    selectFormControl: "selectFormControl-class",
    selectFormControl__disabled: "selectFormControl__disabled-class",
    selectFormControl_badge: "selectFormControl_badge-class",
    selectFormControl_control: "selectFormControl_control-class",
    selectFormControl_controlInput: "selectFormControl_controlInput-class",
    selectFormControl_controlLabel: "selectFormControl_controlLabel-class",
    selectFormControl_controlLabelRegion: "selectFormControl_controlLabelRegion-class",
    selectFormControl_controlRegion: "selectFormControl_controlRegion-class",
    selectFormControl_controlSpan: "selectFormControl_controlSpan-class",
    selectFormControl_defaultValueIndicator:
        "selectFormControl_defaultValueIndicator-class",
    selectFormControl_invalidMessage: "selectFormControl_invalidMessage-class",
    selectFormControl_softRemove: "selectFormControl_softRemove-class",
    selectFormControl_softRemoveInput: "selectFormControl_softRemoveInput-class",
};

const selectProps: SelectFormControlProps = {
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

describe("SelectFormControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <SelectFormControl {...selectProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an HTML select element", () => {
        const rendered: any = mount(
            <SelectFormControl {...selectProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate an HTML select element when there is only one option and select is optional", () => {
        const rendered: any = mount(
            <SelectFormControl
                {...selectProps}
                options={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate HTML options for each passed option", () => {
        const renderedNoOptions: any = mount(
            <SelectFormControl {...selectProps} managedClasses={managedClasses} />
        );

        expect(renderedNoOptions.find("option")).toHaveLength(0);

        const renderedOptions: any = mount(
            <SelectFormControl
                {...selectProps}
                options={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        expect(renderedOptions.find("option")).toHaveLength(2);
    });
    test("should generate an HTML label", () => {
        const rendered: any = mount(
            <SelectFormControl {...selectProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should fire an `onChange` callback when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
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
            <SelectFormControl
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                data={undefined}
                default={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.selectFormControl_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <SelectFormControl
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                data={"foo"}
                default={"bar"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.selectFormControl_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string = "foo";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <SelectFormControl
                {...selectProps}
                managedClasses={managedClasses}
                options={["foo", "bar"]}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.selectFormControl_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue: string = "foo";
        const rendered: any = mount(
            <SelectFormControl
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
            <SelectFormControl
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
