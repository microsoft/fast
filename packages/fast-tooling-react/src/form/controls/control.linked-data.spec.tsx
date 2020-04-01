import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper } from "enzyme";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import {
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnter,
} from "@microsoft/fast-web-utilities";
import { LinkedDataControl } from "./control.linked-data";
import { LinkedDataControlProps } from "./control.linked-data.props";
import { LinkedDataControlClassNameContract } from "./control.linked-data.style";
import { ControlType } from "../templates";
import { LinkedDataActionType } from "../templates/types";

const LinkedDataFormControlWithDragAndDrop: React.FC<any> = (
    props: React.PropsWithChildren<any>
): React.ReactElement => {
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

const managedClasses: LinkedDataControlClassNameContract = {
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

const linkedDataProps: LinkedDataControlProps = {
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
};

/* tslint:disable:no-string-literal */
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
        const rendered: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should add a datalist", () => {
        const rendered: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("datalist")).toHaveLength(1);
    });
    test("should add an `aria-controls` on a text input with the same value as the id of the `listbox`", () => {
        const rendered: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );
        const inputAriaControls: string = rendered.find("input").props()["aria-controls"];
        const datalist: string = rendered.find("datalist").props()["id"];

        expect(inputAriaControls).toEqual(datalist);
    });
    test("should generate options based on the schema items in the schema dictionary", () => {
        const rendered: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                managedClasses={managedClasses}
            />
        );
        const listboxItems: any = rendered.find("datalist option");

        expect(listboxItems).toHaveLength(3);
    });
    test("should show if linkedData are present in the data as a DragItem", () => {
        const renderedWithOneChild: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                value={[{ id: "foo" }]}
                managedClasses={managedClasses}
            />
        );

        expect(renderedWithOneChild.find("DragItem")).toHaveLength(1);
    });
    test("should fire a callback to update the data when the value is changed", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        const targetValue: any = { value: "omega" };
        rendered
            .find("input")
            .simulate("change", { target: targetValue, currentTarget: targetValue });
        rendered.find("input").simulate("keydown", { keyCode: keyCodeEnter });

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
        const callback: any = jest.fn();
        const rendered: ReactWrapper = mount(
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
        const callback: any = jest.fn();
        const rendered: any = mount(
            <LinkedDataFormControlWithDragAndDrop
                {...linkedDataProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        const targetValue: any = { value: "no match" };
        rendered
            .find("input")
            .simulate("change", { target: targetValue, currentTarget: targetValue });
        rendered.find("input").simulate("keydown", { keyCode: keyCodeEnter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should remove a child option from the data when the remove button has been clicked", () => {
        const callback: any = jest.fn();
        const renderedWithTwoLinkedData: any = mount(
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

        renderedWithTwoLinkedData
            .find("DragItem")
            .find("button")
            .simulate("click");

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
