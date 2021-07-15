import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { StandardControlTemplate } from "./template.control.standard";
import { ControlType } from "../index";
import { ControlContext } from "./types";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    DisplayControl,
    NumberFieldControl,
    SectionControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "../controls";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const managedClasses = {
    standardControlTemplate: "standardControlTemplate",
    standardControlTemplate__disabled: "standardControlTemplate__disabled",
    standardControlTemplate_badge: "standardControlTemplate_badge",
    standardControlTemplate_control: "standardControlTemplate_control",
    standardControlTemplate_controlLabel: "standardControlTemplate_controlLabel",
    standardControlTemplate_controlLabelRegion:
        "standardControlTemplate_controlLabelRegion",
    standardControlTemplate_controlRegion: "standardControlTemplate_controlRegion",
    standardControlTemplate_defaultValueIndicator:
        "standardControlTemplate_defaultValueIndicator",
    standardControlTemplate_constValueIndicator:
        "standardControlTemplate_constValueIndicator",
    standardControlTemplate_invalidMessage: "standardControlTemplate_invalidMessage",
    standardControlTemplate_softRemove: "standardControlTemplate_softRemove",
    standardControlTemplate_softRemoveInput: "standardControlTemplate_softRemoveInput",
};
const props = {
    index: 1,
    type: ControlType.textarea,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    dataDictionary: [
        {
            "": {
                schemaId: "",
                data: {},
            },
        },
        "",
    ],
    navigation: {},
    schemaLocation: "",
    control: jest.fn(),
    data: void 0,
    schemaDictionary: {},
    schema: {},
    required: void 0,
    label: "foo",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    invalidMessage: "",
    validationErrors: [],
    component: null,
    controlComponents: {
        [ControlType.array]: ArrayControl,
        [ControlType.button]: ButtonControl,
        [ControlType.checkbox]: CheckboxControl,
        [ControlType.display]: DisplayControl,
        [ControlType.numberField]: NumberFieldControl,
        [ControlType.sectionLink]: SectionLinkControl,
        [ControlType.section]: SectionControl,
        [ControlType.select]: SelectControl,
        [ControlType.textarea]: TextareaControl,
    },
    controls: {
        [ControlType.array]: null,
        [ControlType.linkedData]: null,
        [ControlType.button]: null,
        [ControlType.checkbox]: null,
        [ControlType.display]: null,
        [ControlType.numberField]: null,
        [ControlType.sectionLink]: null,
        [ControlType.section]: null,
        [ControlType.select]: null,
        [ControlType.textarea]: null,
    },
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
    categories: {},
};
describe("StandardControlTemplate", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<StandardControlTemplate {...props} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML label element", () => {
        const rendered = mount(
            <StandardControlTemplate {...props} managedClasses={managedClasses} />
        );
        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange = jest.fn();
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                data={"foo"}
                softRemove={true}
                required={false}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );
        // two of these are found as at(0) is the render function and at(1) is the input
        rendered
            .find(`.${managedClasses.standardControlTemplate_softRemoveInput}`)
            .at(1)
            .simulate("change");
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should have the disabled class when disabled prop is passed", () => {
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                data={"foo"}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        const wrapper = rendered.find(
            `.${managedClasses.standardControlTemplate__disabled}`
        );
        expect(wrapper).toHaveLength(1);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange = jest.fn();
        const data = "foo";
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                data={data}
                softRemove={true}
                onChange={handleChange}
                managedClasses={managedClasses}
            />
        );
        // two of these are found as at(0) is the render function and at(1) is the input
        rendered
            .find(`.${managedClasses.standardControlTemplate_softRemoveInput}`)
            .at(1)
            .simulate("change");
        rendered.setProps({ data: handleChange.mock.calls[0][1] });
        rendered
            .find(`.${managedClasses.standardControlTemplate_softRemoveInput}`)
            .at(1)
            .simulate("change");
        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(data);
    });
    test("should have an invalid message element if an invalid message is passed", () => {
        const invalidMessage = "Foo";
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                displayValidationInline={true}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );
        expect(
            rendered.find(`.${managedClasses.standardControlTemplate_invalidMessage}`)
        ).toHaveLength(1);
    });
    test("should not have an invalid message element if an invalid message is passed as an empty string", () => {
        const invalidMessage = "";
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                displayValidationInline={true}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );
        expect(
            rendered.find(`.${managedClasses.standardControlTemplate_invalidMessage}`)
        ).toHaveLength(0);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage = "Foo";
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                data={"foo"}
                invalidMessage={invalidMessage}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage = "Foo";
        const rendered = mount(
            <StandardControlTemplate
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
        const invalidMessage1 = "Foo";
        const invalidMessage2 = "Bar";
        const rendered = mount(
            <StandardControlTemplate
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
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                managedClasses={managedClasses}
                data={undefined}
                default={"foo"}
            />
        );
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_defaultValueIndicator}`
            )
        ).toHaveLength(2); // two of these are found as at(0) is the render function and at(1) is the node
    });
    test("should show a const indicator if const value is passed and data does not match the const", () => {
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                managedClasses={managedClasses}
                data={undefined}
                const={"foo"}
            />
        );
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_constValueIndicator}`
            )
        ).toHaveLength(2); // two of these are found as at(0) is the render function and at(1) is the node
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue = "foo";
        const callback = jest.fn();
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                managedClasses={managedClasses}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );
        expect(callback).not.toHaveBeenCalled();
        rendered
            .find(`.${managedClasses.standardControlTemplate_defaultValueIndicator}`)
            .at(1) // two of these are found as at(0) is the render function and at(1) is the node
            .simulate("click");
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0].dataLocation).toEqual("");
        expect(callback.mock.calls[0][0].value).toEqual(defaultValue);
    });
    test("should show the control in default context when no context has been passed", () => {
        const id = "foo";
        const myControl = config => <div id={id} />;
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                managedClasses={managedClasses}
                control={myControl}
            />
        );
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_controlLabelRegion} + #${id}`
            )
        ).toHaveLength(1);
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_controlRegion} + #${id}`
            )
        ).toHaveLength(0);
    });
    test("should show the control in default context when default context has been passed", () => {
        const id = "foo";
        const myControl = config => <div id={id} />;
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                context={ControlContext.default}
                managedClasses={managedClasses}
                control={myControl}
            />
        );
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_controlLabelRegion} + #${id}`
            )
        ).toHaveLength(1);
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_controlRegion} + #${id}`
            )
        ).toHaveLength(0);
    });
    test("should show the control in fill context when fill context has been passed", () => {
        const id = "foo";
        const myControl = config => <div id={id} />;
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                context={ControlContext.fill}
                managedClasses={managedClasses}
                control={myControl}
            />
        );
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_controlLabelRegion} + #${id}`
            )
        ).toHaveLength(0);
        expect(
            rendered.find(
                `.${managedClasses.standardControlTemplate_controlRegion} + #${id}`
            )
        ).toHaveLength(1);
    });
    test("should add a title attribute to the label if the labelTooltip has been passed", () => {
        const tooltip = "foo";
        const rendered = mount(
            <StandardControlTemplate
                {...props}
                managedClasses={managedClasses}
                labelTooltip={tooltip}
            />
        );
        expect(
            rendered
                .find(`.${managedClasses.standardControlTemplate_controlLabel}`)
                .prop("title")
        ).toEqual(tooltip);
    });
});
