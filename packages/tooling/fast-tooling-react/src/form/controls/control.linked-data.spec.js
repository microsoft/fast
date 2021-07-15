import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { keyCodeEnter, keyCodeTab } from "@microsoft/fast-web-utilities";
import { LinkedDataControl } from "./control.linked-data";
import { ControlType } from "../templates";
import { LinkedDataActionType } from "../templates/types";
import defaultStrings from "../form.strings";
const LinkedDataFormControlWithDragAndDrop = props => {
    return (
        <DndProvider backend={HTML5Backend}>
            <LinkedDataControl {...props} />
        </DndProvider>
    );
};
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const managedClasses = {
    linkedDataControl: "linkedDataFormControl-class",
    linkedDataControl_linkedDataListControl:
        "linkedDataFormControl_linkedDataListControl-class",
    linkedDataControl_linkedDataListInput:
        "linkedDataFormControl_linkedDataListInput-class",
    linkedDataControl_delete: "linkedDataFormControl_delete-class",
    linkedDataControl_deleteButton: "linkedDataFormControl_deleteButton-class",
    linkedDataControl_existingLinkedData:
        "linkedDataFormControl_existingLinkedData-class",
    linkedDataControl_existingLinkedDataItem:
        "linkedDataFormControl_existingLinkedDataItem-class",
    linkedDataControl_existingLinkedDataItemContent:
        "linkedDataFormControl_existingLinkedDataItemContent-class",
    linkedDataControl_existingLinkedDataItemLink:
        "linkedDataFormControl_existingLinkedDataItemLink-class",
    linkedDataControl_existingLinkedDataItemName:
        "linkedDataFormControl_existingLinkedDataItemName-class",
};
const linkedDataProps = {
    type: ControlType.linkedData,
    schemaDictionary: {
        alpha: {
            title: "alpha",
            id: "alpha",
            type: "object",
            properties: {},
        },
        beta: {
            title: "beta",
            id: "beta",
            type: "object",
            properties: {},
        },
        omega: {
            title: "omega",
            id: "omega",
            type: "object",
            properties: {},
        },
    },
    required: false,
    dataLocation: "locationOfLinkedData",
    navigationConfigId: "",
    dictionaryId: "",
    dataDictionary: [
        {
            "": {
                schemaId: "alpha",
                data: {},
            },
            foo: {
                schemaId: "beta",
                data: {},
            },
        },
        "",
    ],
    navigation: {},
    value: undefined,
    schema: {},
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    disabled: false,
    elementRef: null,
    validationErrors: [],
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
};
describe("LinkedDataControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(
                <LinkedDataFormControlWithDragAndDrop
                    {...linkedDataProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should generate a text input", () => {
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should add a datalist", () => {
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find("datalist")).toHaveLength(1);
    });
    test("should add an `aria-controls` on a text input with the same value as the id of the `listbox`", () => {
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );
        const inputAriaControls = rendered.find("input").props()["aria-controls"];
        const datalist = rendered.find("datalist").props()["id"];
        expect(inputAriaControls).toEqual(datalist);
    });
    test("should generate options based on the schema items in the schema dictionary", () => {
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );
        const listboxItems = rendered.find("datalist option");
        expect(listboxItems).toHaveLength(3);
    });
    test("should show if linkedData are present in the data as a DragItem", () => {
        const renderedWithOneChild = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                value={[{ id: "foo" }]}
                managedClasses={managedClasses}
            />
        );
        expect(renderedWithOneChild.find("DragItem")).toHaveLength(1);
    });
    test("should not update the value to match when there are multiple matching values", () => {
        const callback = jest.fn();
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        const targetValue = { value: "a" };
        const input = rendered.find("input");
        input.simulate("change", { target: targetValue });
        input.simulate("keydown", { keyCode: keyCodeTab });
        expect(input.getDOMNode().value).toEqual("a");
        expect(callback).not.toHaveBeenCalled();
    });
    test("should update the value to match when there is a single matching value", () => {
        const callback = jest.fn();
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        const targetValue = { value: "ome" };
        const input = rendered.find("input");
        input.simulate("change", { target: targetValue });
        input.simulate("keydown", { keyCode: keyCodeTab });
        expect(input.getDOMNode().value).toEqual("omega");
        expect(callback).not.toHaveBeenCalled();
    });
    test("should fire a callback to update the data when the value is an exact match and enter has been pressed", () => {
        const callback = jest.fn();
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        const targetValue = { value: "omega" };
        const input = rendered.find("input");
        input.simulate("change", { target: targetValue });
        input.simulate("keydown", { keyCode: keyCodeEnter });
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual({
            index: 0,
            isLinkedData: true,
            linkedDataAction: LinkedDataActionType.add,
            value: [
                {
                    data: {},
                    parent: {
                        dataLocation: "locationOfLinkedData",
                        id: "",
                    },
                    schemaId: "omega",
                },
            ],
        });
    });
    test("should update active section to the linked data item clicked", () => {
        const callback = jest.fn();
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                value={[{ id: "foo" }]}
                onUpdateSection={callback}
                managedClasses={managedClasses}
            />
        );
        rendered
            .find(`li.${managedClasses.linkedDataControl_existingLinkedDataItem} > a`)
            .simulate("click");
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual("foo");
    });
    test("should not fire a callback to update the data when the value is changed but there is no match", () => {
        const callback = jest.fn();
        const rendered = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        const targetValue = { value: "no match" };
        rendered
            .find("input")
            .simulate("change", { target: targetValue, currentTarget: targetValue });
        rendered.find("input").simulate("keydown", { keyCode: keyCodeEnter });
        expect(callback).not.toHaveBeenCalled();
    });
    test("should remove a child option from the data when the remove button has been clicked", () => {
        const callback = jest.fn();
        const renderedWithTwoLinkedData = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
                value={[
                    {
                        id: "foo",
                    },
                ]}
                onChange={callback}
            />
        );
        renderedWithTwoLinkedData.find("DragItem").find("button").simulate("click");
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual({
            isLinkedData: true,
            linkedDataAction: LinkedDataActionType.remove,
            value: [
                {
                    id: "foo",
                },
            ],
        });
    });
});
