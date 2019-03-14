import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import FormItemArrayStyled, { FormItemArray } from "./form-item.array";
import {
    FormItemArrayClassNameContract,
    FormItemArrayProps,
} from "./form-item.array.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const arrayProps: FormItemArrayProps = {
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
};

const managedClasses: FormItemArrayClassNameContract = {
    formItemArray: "formItemArray-class",
    formItemArray_control: "formItemArray_control-class",
    formItemArray_controlAddButton: "formItemArray_controlAddButton-class",
    formItemArray_controlLabel: "formItemArray_controlLabel-class",
    formItemArray_existingItemList: "formItemArray_existingItemList-class",
    formItemArray_existingItemListItem: "formItemArray_existingItemListItem-class",
    formItemArray_existingItemListItem__sorting:
        "formItemArray_existingItemListItem__sorting-class",
    formItemArray_existingItemListItemLink:
        "formItemArray_existingItemListItemLink-class",
    formItemArray_existingItemRemoveButton:
        "formItemArray_existingItemRemoveButton-class",
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

describe("Array", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<FormItemArrayStyled {...arrayProps} />);
        }).not.toThrow();
    });
    test("should generate a button to add an array item if the maximum number of items has not been reached", () => {
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                schema={{ maxItems: 2 }}
                data={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemArray_controlAddButton}`).length
        ).toEqual(1);
    });
    test("should generate a button to add an array item if no maximum number of items has been specified", () => {
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                data={["foo"]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemArray_controlAddButton}`).length
        ).toEqual(1);
    });
    test("should not generate a button to add an array item if the maximum number of items has been reached", () => {
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                schema={{ maxItems: 2 }}
                data={["foo", "bar"]}
                managedClasses={managedClasses}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemArray_controlAddButton}`).length
        ).toEqual(0);
    });
    test("should add an item to the array if the add button has been clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                schema={schema}
                data={["foo"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );
        const addButton: any = rendered.find(
            `.${managedClasses.formItemArray_controlAddButton}`
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
            <FormItemArray
                {...arrayProps}
                schema={schema}
                data={["foo", "bar", "bat"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemArray_existingItemRemoveButton}`)
                .length
        ).toBe(3);
    });
    test("should show a remove button on an existing array item if the minimum number of items has not been specified", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                data={["foo", "bar"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemArray_existingItemRemoveButton}`)
                .length
        ).toBe(2);
    });
    test("should not show a remove button on existing array items if the minimum number of items has been reached", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                schema={schema}
                data={["foo", "bar"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemArray_existingItemRemoveButton}`)
                .length
        ).toBe(0);
    });
    test("should remove an array item if the remove button has been clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemArray
                {...arrayProps}
                schema={schema}
                data={["foo", "bar", "bat"]}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );
        const removeButton: any = rendered
            .find(`.${managedClasses.formItemArray_existingItemRemoveButton}`)
            .at(1);
        removeButton.simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(callback.mock.calls[0][1]).toBe(undefined);
        expect(callback.mock.calls[0][2]).toBe(true);
        expect(callback.mock.calls[0][3]).toBe(1);
    });
});
