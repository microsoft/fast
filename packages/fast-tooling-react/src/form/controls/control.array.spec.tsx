import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import ArrayFormControlStyled, {
    TestArrayFormControl as ArrayFormControl,
} from "./control.array";
import {
    ArrayFormControlClassNameContract,
    ArrayFormControlProps,
} from "./control.array.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const arrayProps: ArrayFormControlProps = {
    untitled: "",
    index: 1,
    dataLocation: "",
    schemaLocation: "",
    data: "",
    schema: {},
    required: false,
    label: "",
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
    invalidMessage: "",
};

const managedClasses: ArrayFormControlClassNameContract = {
    arrayFormControl: "arrayFormControl-class",
    arrayFormControl_control: "arrayFormControl_control-class",
    arrayFormControl_addItem: "arrayFormControl_addItem-class",
    arrayFormControl_addItemLabel: "arrayFormControl_addItemLabel-class",
    arrayFormControl_addItemButton: "arrayFormControl_controlAddButton-class",
    arrayFormControl_controlLabel: "arrayFormControl_controlLabel-class",
    arrayFormControl_controlLabel__invalid:
        "arrayFormControl_controlLabel__invalid-class",
    arrayFormControl_defaultValueIndicator:
        "arrayFormControl_defaultValueIndicator-class",
    arrayFormControl_existingItemList: "arrayFormControl_existingItemList-class",
    arrayFormControl_existingItemListItem: "arrayFormControl_existingItemListItem-class",
    arrayFormControl_existingItemListItem__sorting:
        "arrayFormControl_existingItemListItem__sorting-class",
    arrayFormControl_existingItemListItemLink:
        "arrayFormControl_existingItemListItemLink-class",
    arrayFormControl_existingItemListItemLink__default:
        "arrayFormControl_existingItemListItemLink__default-class",
    arrayFormControl_existingItemRemoveButton:
        "arrayFormControl_existingItemRemoveButton-class",
};

const schema: any = {
    title: "Array of strings",
    type: "array",
    items: {
        title: "String",
        type: "string",
    },
    minItems: 2,
    maxItems: 5,
};

describe("ArrayFormControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<ArrayFormControlStyled {...arrayProps} />);
        }).not.toThrow();
    });
    test("should generate a button to add an array item if the maximum number of items has not been reached", () => {
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={{ maxItems: 2 }}
                data={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_addItemButton}`).length
        ).toEqual(1);
    });
    test("should generate a button to add an array item if no maximum number of items has been specified", () => {
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                data={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_addItemButton}`).length
        ).toEqual(1);
    });
    test("should not generate a button to add an array item if the maximum number of items has been reached", () => {
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={{ maxItems: 2 }}
                data={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_addItemButton}`).length
        ).toEqual(0);
    });
    test("should add an item to the array if the add button has been clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={schema}
                data={["foo"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );
        const addButton: any = rendered.find(
            `.${managedClasses.arrayFormControl_addItemButton}`
        );
        addButton.simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(typeof callback.mock.calls[0][1]).toBe("string");
        expect(callback.mock.calls[0][2]).toBe(true);
        expect(callback.mock.calls[0][3]).toBe(undefined);
    });
    test("should show a remove button on an existing array item if the minimum number of items has not been reached", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={schema}
                data={["foo", "bar", "bat"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_existingItemRemoveButton}`)
                .length
        ).toBe(3);
    });
    test("should show a remove button on an existing array item if the minimum number of items has not been specified", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                data={["foo", "bar"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_existingItemRemoveButton}`)
                .length
        ).toBe(2);
    });
    test("should not show a remove button on existing array items if the minimum number of items has been reached", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={schema}
                data={["foo", "bar"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_existingItemRemoveButton}`)
                .length
        ).toBe(0);
    });
    test("should remove an array item if the remove button has been clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={schema}
                data={["foo", "bar", "bat"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );
        const removeButton: any = rendered
            .find(`.${managedClasses.arrayFormControl_existingItemRemoveButton}`)
            .at(1);
        removeButton.simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toBe(undefined);
        expect(callback.mock.calls[0][2]).toBe(true);
        expect(callback.mock.calls[0][3]).toBe(1);
    });
    test("should remove the data if the soft remove is triggered", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={schema}
                data={["foo", "bar", "bat"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const callback: any = jest.fn();
        const data: string[] = ["foo", "bar", "bat"];
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                schema={schema}
                data={data}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        rendered.setProps({ data: callback.mock.calls[0][1] });

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.mock.calls[1][1]).toBe(data);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                managedClasses={managedClasses}
                invalidMessage={invalidMessage}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
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
            <ArrayFormControl
                {...arrayProps}
                managedClasses={managedClasses}
                invalidMessage={invalidMessage1}
                displayValidationInline={true}
            />
        );

        expect(rendered.html().includes(invalidMessage1)).toBe(true);

        rendered.setProps({ invalidMessage: invalidMessage2 });

        expect(rendered.html().includes(invalidMessage2)).toBe(true);
    });
    test("should add an invalid data class if there is an invalid message", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                managedClasses={managedClasses}
                invalidMessage={invalidMessage}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_controlLabel__invalid}`)
        ).toHaveLength(1);
    });
    test("should not add an invalid data class if an invalid message has not been passed", () => {
        const invalidMessage: string = "";
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                managedClasses={managedClasses}
                invalidMessage={invalidMessage}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_controlLabel__invalid}`)
        ).toHaveLength(0);
    });
    test("should show a default indicator if default values exist and no data is available", () => {
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                data={undefined}
                default={[]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                data={[]}
                default={[]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.arrayFormControl_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string[] = [];
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                onChange={callback}
                data={undefined}
                default={defaultValue}
                managedClasses={managedClasses}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.arrayFormControl_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
        expect(callback.mock.calls[0][2]).toEqual(undefined);
        expect(callback.mock.calls[0][3]).toEqual(undefined);
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultArrayItem1: string = "foo";
        const defaultArrayItem2: string = "bar";
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                data={undefined}
                default={[defaultArrayItem1, defaultArrayItem2]}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.html().includes(defaultArrayItem1)).toBe(true);
        expect(rendered.html().includes(defaultArrayItem2)).toBe(true);
    });
    test("should not show default values if data exists", () => {
        const arrayItem1: string = "foo";
        const arrayItem2: string = "bar";
        const defaultArrayItem1: string = "hello";
        const defaultArrayItem2: string = "world";
        const rendered: any = mount(
            <ArrayFormControl
                {...arrayProps}
                data={[arrayItem1, arrayItem2]}
                default={[defaultArrayItem1, defaultArrayItem2]}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.html().includes(arrayItem1)).toBe(true);
        expect(rendered.html().includes(arrayItem2)).toBe(true);
        expect(rendered.html().includes(defaultArrayItem1)).toBe(false);
        expect(rendered.html().includes(defaultArrayItem2)).toBe(false);
    });
});
