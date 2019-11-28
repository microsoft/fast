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
import { ChildrenControl } from "./control.children";
import { ChildrenControlProps } from "./control.children.props";
import { ChildrenControlClassNameContract } from "./control.children.style";
import { ControlType } from "../templates";

const ChildrenFormControlWithDragAndDrop: React.FC<any> = (
    props: React.PropsWithChildren<any>
): React.ReactElement => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ChildrenControl {...props} />
        </DndProvider>
    );
};

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: ChildrenControlClassNameContract = {
    childrenControl: "childrenFormControl-class",
    childrenControl_childrenList: "childrenFormControl_childrenList-class",
    childrenControl_childrenListControl: "childrenFormControl_childrenListControl-class",
    childrenControl_childrenListInput: "childrenFormControl_childrenListInput-class",
    childrenControl_childrenListItem: "childrenFormControl_childrenListItem-class",
    childrenControl_childrenListTrigger: "childrenFormControl_childrenListTrigger-class",
    childrenControl_delete: "childrenFormControl_delete-class",
    childrenControl_deleteButton: "childrenFormControl_deleteButton-class",
    childrenControl_existingChildren: "childrenFormControl_existingChildren-class",
    childrenControl_existingChildrenItem:
        "childrenFormControl_existingChildrenItem-class",
    childrenControl_existingChildrenItemContent:
        "childrenFormControl_existingChildrenItemContent-class",
    childrenControl_existingChildrenItemLink:
        "childrenFormControl_existingChildrenItemLink-class",
    childrenControl_existingChildrenItemName:
        "childrenFormControl_existingChildrenItemName-class",
    childrenControl_existingChildrenItem__default:
        "childrenFormControl_existingChildrenItem__default-class",
};

const childrenProps: ChildrenControlProps = {
    type: ControlType.children,
    childOptions: [
        {
            name: "alpha",
            component: null,
            schema: {
                id: "alpha",
                type: "object",
                properties: {},
            },
        },
        {
            name: "beta 1",
            component: null,
            schema: {
                id: "beta 1",
                type: "object",
                properties: {},
            },
        },
        {
            name: "beta 2",
            component: null,
            schema: {
                id: "beta 2",
                type: "object",
                properties: {},
            },
        },
    ],
    required: false,
    dataLocation: "locationOfChildren",
    value: undefined,
    schema: {},
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    disabled: false,
    elementRef: null,
    validationErrors: [],
};

/* tslint:disable:no-string-literal */
describe("ChildrenControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(
                <ChildrenFormControlWithDragAndDrop
                    {...childrenProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should generate a text input", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should add an `aria-autocomplete` with `list` value on a text input", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const input: any = rendered.find("input");

        expect(input.props()["aria-autocomplete"]).toEqual("list");
    });
    test("should generate a button", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find("button")).toHaveLength(1);
    });
    test("should generate a listbox", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const listbox: any = rendered.find("ul");

        expect(listbox).toHaveLength(1);
        expect(listbox.props()["role"]).toEqual("listbox");
    });
    test("should add an `aria-controls` on a text input with the same value as the id of the `listbox`", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const inputAriaControls: string = rendered.find("input").props()["aria-controls"];
        const listboxId: string = rendered.find("ul").props()["id"];

        expect(inputAriaControls).toEqual(listboxId);
    });
    test("should have a listbox with an `aria-hidden` attribute set to `true`", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const listbox: any = rendered.find("ul");

        expect(listbox.props()["aria-hidden"]).toEqual(true);
    });
    test("should have a listbox with an `aria-hidden` attribute set to `false` when the button is clicked", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const button: any = rendered.find("button");

        button.simulate("click");

        const listbox: any = rendered.find("ul");

        expect(listbox.props()["aria-hidden"]).toEqual(false);
    });
    test("should generate options based on the `childOptions` provided", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const listboxItems: any = rendered.find("ul li");

        expect(listboxItems).toHaveLength(3);
    });
    test("should generate options based on the `childOptions` provided and filtered by a search term", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const input: any = rendered.find("input");

        input.simulate("change", { target: { value: "beta" } });

        const listboxItems: any = rendered.find("ul li");

        expect(listboxItems).toHaveLength(2);
    });
    test("should have a listbox that can be navigated by the `down` key", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const button: any = rendered.find("button");
        const input: any = rendered.find("input");

        button.simulate("click");

        expect(
            rendered
                .find("ul li")
                .at(0)
                .props()["aria-selected"]
        ).toEqual(true);

        input.simulate("keydown", { keyCode: keyCodeArrowDown });

        expect(
            rendered
                .find("ul li")
                .at(0)
                .props()["aria-selected"]
        ).toEqual(false);
        expect(
            rendered
                .find("ul li")
                .at(1)
                .props()["aria-selected"]
        ).toEqual(true);

        input.simulate("keydown", { keyCode: keyCodeArrowDown });

        expect(
            rendered
                .find("ul li")
                .at(1)
                .props()["aria-selected"]
        ).toEqual(false);
        expect(
            rendered
                .find("ul li")
                .at(2)
                .props()["aria-selected"]
        ).toEqual(true);

        input.simulate("keydown", { keyCode: keyCodeArrowDown });

        expect(
            rendered
                .find("ul li")
                .at(2)
                .props()["aria-selected"]
        ).toEqual(false);
        expect(
            rendered
                .find("ul li")
                .at(0)
                .props()["aria-selected"]
        ).toEqual(true);
    });
    test("should have a listbox that can be navigated by the `up` key", () => {
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
            />
        );
        const button: any = rendered.find("button");
        const input: any = rendered.find("input");

        button.simulate("click");

        expect(
            rendered
                .find("ul li")
                .at(0)
                .props()["aria-selected"]
        ).toEqual(true);

        input.simulate("keydown", { keyCode: keyCodeArrowUp });

        expect(
            rendered
                .find("ul li")
                .at(0)
                .props()["aria-selected"]
        ).toEqual(false);
        expect(
            rendered
                .find("ul li")
                .at(2)
                .props()["aria-selected"]
        ).toEqual(true);

        input.simulate("keydown", { keyCode: keyCodeArrowUp });

        expect(
            rendered
                .find("ul li")
                .at(2)
                .props()["aria-selected"]
        ).toEqual(false);
        expect(
            rendered
                .find("ul li")
                .at(1)
                .props()["aria-selected"]
        ).toEqual(true);

        input.simulate("keydown", { keyCode: keyCodeArrowUp });

        expect(
            rendered
                .find("ul li")
                .at(1)
                .props()["aria-selected"]
        ).toEqual(false);
        expect(
            rendered
                .find("ul li")
                .at(0)
                .props()["aria-selected"]
        ).toEqual(true);
    });
    test("should show if children are present in the data as an item with a button", () => {
        const renderedWithOneChild: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                value={{ id: "alpha", props: {} }}
                managedClasses={managedClasses}
            />
        );

        expect(
            renderedWithOneChild
                .find("ul")
                .at(0)
                .find("li")
        ).toHaveLength(1);

        const renderedWithOneChildString: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                value={"hello world"}
                managedClasses={managedClasses}
            />
        );

        expect(
            renderedWithOneChild
                .find("ul")
                .at(0)
                .find("li")
        ).toHaveLength(1);

        const renderedWithThreeChildren: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
                value={[
                    {
                        id: "alpha",
                        props: {},
                    },
                    {
                        id: "beta 1",
                        props: {},
                    },
                    "hello world",
                ]}
            />
        );

        expect(
            renderedWithThreeChildren
                .find("ul")
                .at(0)
                .find("li")
        ).toHaveLength(3);
    });
    test("should fire a callback to update the data when an `option` in the `listbox` is clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("ul")
            .at(0)
            .find("li")
            .at(1)
            .simulate("click");

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual({
            value: [{ id: "beta 1", props: {} }],
        });
    });
    test("should fire a callback to update the data when a default text `option` in the `listbox` is clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
                defaultChildOptions={["text"]}
                onChange={callback}
            />
        );

        rendered
            .find("ul")
            .at(0)
            .find("li")
            .at(0)
            .simulate("click");

        expect(callback).toHaveBeenCalled();
        expect(Array.isArray(callback.mock.calls[0][0].value)).toBe(true);
        expect(typeof callback.mock.calls[0][0].value[0]).toEqual("string");
    });
    test("should update active section to item clicked when ctrl key is pressed and a new item is provided", () => {
        const childItem: any = Symbol();
        const callback: any = jest.fn();
        const rendered: ReactWrapper = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                onUpdateSection={callback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("ul")
            .at(0)
            .find("li")
            .at(1)
            .simulate("click", { ctrlKey: true });

        rendered.setProps(
            Object.assign({}, childrenProps, {
                value: childItem,
                onUpdateSection: callback,
            })
        );

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].dataLocation).toEqual(
            "locationOfChildren.props"
        );
    });
    test("should update active section to item clicked when ctrl key is pressed and a new item is provided to an existing set of items", () => {
        const callback: any = jest.fn();
        const rendered: ReactWrapper = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                value={[Symbol(), Symbol()]}
                onUpdateSection={callback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("ul")
            .at(1)
            .find("li")
            .at(1)
            .simulate("click", { ctrlKey: true });

        rendered.setProps(
            Object.assign({}, childrenProps, {
                value: [Symbol(), Symbol(), Symbol()],
                onUpdateSection: callback,
            })
        );

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].dataLocation).toEqual(
            "locationOfChildren[2].props"
        );
    });
    test("should not add a child option to the data when a value has been added to the `input` that is an empty string", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "" } });
        rendered.find("input").simulate("keydown", { keyCode: keyCodeEnter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should not add a child option to the data when a value has been added to the `input` that does not partially match any of the options", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "echo" } });
        rendered.find("input").simulate("keydown", { keyCode: keyCodeEnter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should add a child option to the data when a value has been added to the `input` that at least partially matches one of the options", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "b" } });
        rendered.find("input").simulate("keydown", { keyCode: keyCodeEnter });

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual({
            value: [{ id: "beta 1", props: {} }],
        });
    });
    test("should remove a child option from the data when the remove button has been clicked", () => {
        const callback: any = jest.fn();
        const renderedWithTwoChildren: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
                value={[
                    {
                        id: "alpha",
                        props: {},
                    },
                    {
                        id: "beta 1",
                        props: {},
                    },
                ]}
                onChange={callback}
            />
        );

        renderedWithTwoChildren
            .find("ul")
            .at(0)
            .find("li")
            .at(1)
            .find("button")
            .simulate("click");

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual({
            value: undefined,
            isArray: true,
            index: 1,
        });
    });
    test("should show default values if they exist and no data is available", () => {
        const children: string = "foo";
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
                value={undefined}
                default={children}
            />
        );

        expect(rendered.html().includes(children)).toBe(true);
    });
    test("should not show default values if data exists", () => {
        const children: string = "foo";
        const defaultChildren: string = "bar";
        const rendered: any = mount(
            <ChildrenFormControlWithDragAndDrop
                {...childrenProps}
                managedClasses={managedClasses}
                value={children}
                default={defaultChildren}
            />
        );
        expect(rendered.html().includes(children)).toBe(true);
        expect(rendered.html().includes(defaultChildren)).toBe(false);
    });
});
