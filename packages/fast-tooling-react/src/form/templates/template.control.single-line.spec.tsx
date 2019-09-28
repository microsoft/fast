import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SingleLineControlTemplate } from "./template.control.single-line";
import { SingleLineControlTemplateProps } from "./template.control.single-line.props";
import { SingleLineControlTemplateClassNameContract } from "./template.control.single-line.style";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: SingleLineControlTemplateClassNameContract = {
    singleLineControlTemplate: "singleLineControlTemplate",
    singleLineControlTemplate__disabled: "singleLineControlTemplate__disabled",
    singleLineControlTemplate_badge: "singleLineControlTemplate_badge",
    singleLineControlTemplate_control: "singleLineControlTemplate_control",
    singleLineControlTemplate_defaultValueIndicator:
        "singleLineControlTemplate_defaultValueIndicator",
    singleLineControlTemplate_invalidMessage: "singleLineControlTemplate_invalidMessage",
    singleLineControlTemplate_label: "singleLineControlTemplate_label",
    singleLineControlTemplate_softRemove: "singleLineControlTemplate_softRemove",
    singleLineControlTemplate_softRemoveInput:
        "singleLineControlTemplate_softRemoveInput",
};

const props: SingleLineControlTemplateProps = {
    index: 1,
    dataLocation: "",
    schemaLocation: "",
    control: jest.fn(),
    data: void 0,
    required: void 0,
    label: "foo",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    invalidMessage: "",
};

describe("SingleLineControlTemplate", () => {
    test("should not throw", () => {
        expect(() => {
            mount(
                <SingleLineControlTemplate {...props} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(
            <SingleLineControlTemplate {...props} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
                data={"foo"}
                required={false}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        // two of these are found as at(0) is the render function and at(1) is the input
        rendered
            .find(`.${managedClasses.singleLineControlTemplate_softRemoveInput}`)
            .at(1)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should have the disabled class when disabled prop is passed", () => {
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
                data={"foo"}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        const wrapper: any = rendered.find(
            `.${managedClasses.singleLineControlTemplate__disabled}`
        );

        expect(wrapper).toHaveLength(1);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "foo";
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
                data={data}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );

        // two of these are found as at(0) is the render function and at(1) is the input
        rendered
            .find(`.${managedClasses.singleLineControlTemplate_softRemoveInput}`)
            .at(1)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find(`.${managedClasses.singleLineControlTemplate_softRemoveInput}`)
            .at(1)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
    test("should have an invalid message element if an invalid message is passed", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
                displayValidationInline={true}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.singleLineControlTemplate_invalidMessage}`)
        ).toHaveLength(1);
    });
    test("should not have an invalid message element if an invalid message is passed as an empty string", () => {
        const invalidMessage: string = "";
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
                displayValidationInline={true}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.singleLineControlTemplate_invalidMessage}`)
        ).toHaveLength(0);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
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
            <SingleLineControlTemplate
                {...props}
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
            <SingleLineControlTemplate
                {...props}
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
            <SingleLineControlTemplate
                {...props}
                managedClasses={managedClasses}
                data={undefined}
                default={"foo"}
            />
        );

        expect(
            rendered.find(
                `.${managedClasses.singleLineControlTemplate_defaultValueIndicator}`
            )
        ).toHaveLength(2); // two of these are found as at(0) is the render function and at(1) is the node
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string = "foo";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <SingleLineControlTemplate
                {...props}
                managedClasses={managedClasses}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.singleLineControlTemplate_defaultValueIndicator}`)
            .at(1) // two of these are found as at(0) is the render function and at(1) is the node
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
});
