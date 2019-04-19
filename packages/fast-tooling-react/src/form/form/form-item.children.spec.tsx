import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { FormItemChildren } from "./form-item.children";
import {
    FormItemChildrenClassNameContract,
    FormItemChildrenProps,
} from "./form-item.children.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemChildrenClassNameContract = {
    formItemChildren: "formItemChildren-class",
    formItemChildren_badge: "formItemChildren_badge-class",
    formItemChildren_childrenList: "formItemChildren_childrenList-class",
    formItemChildren_childrenListControl: "formItemChildren_childrenListControl-class",
    formItemChildren_childrenListInput: "formItemChildren_childrenListInput-class",
    formItemChildren_childrenListItem: "formItemChildren_childrenListItem-class",
    formItemChildren_childrenListTrigger: "formItemChildren_childrenListTrigger-class",
    formItemChildren_control: "formItemChildren_control-class",
    formItemChildren_controlLabel: "formItemChildren_controlLabel-class",
    formItemChildren_controlLabelRegion: "formItemChildren_controlLabelRegion-class",
    formItemChildren_defaultValueIndicator:
        "formItemChildren_defaultValueIndicator-class",
    formItemChildren_delete: "formItemChildren_delete-class",
    formItemChildren_deleteButton: "formItemChildren_deleteButton-class",
    formItemChildren_existingChildren: "formItemChildren_existingChildren-class",
    formItemChildren_existingChildrenItem: "formItemChildren_existingChildrenItem-class",
    formItemChildren_existingChildrenItemContent:
        "formItemChildren_existingChildrenItemContent-class",
    formItemChildren_existingChildrenItemLink:
        "formItemChildren_existingChildrenItemLink-class",
    formItemChildren_existingChildrenItemName:
        "formItemChildren_existingChildrenItemName-class",
    formItemChildren_existingChildrenItem__default:
        "formItemChildren_existingChildrenItem__default-class",
    formItemChildren_existingChildrenItem__sorting:
        "formItemChildren_existingChildrenItem__sorting-class",
};

const childrenProps: FormItemChildrenProps = {
    index: 0,
    required: false,
    label: "label",
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
    schema: {},
    dataLocation: "locationOfChildren",
    data: undefined,
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
    invalidMessage: "",
};

/* tslint:disable:no-string-literal */
describe("Children", () => {
    test("should not throw", () => {
        expect(() => {
            mount(
                <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should generate a text input", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should add an `aria-autocomplete` with `list` value on a text input", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const input: any = rendered.find("input");

        expect(input.props()["aria-autocomplete"]).toEqual("list");
    });
    test("should generate a button", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("button")).toHaveLength(1);
    });
    test("should generate a label", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should generate a listbox", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const listbox: any = rendered.find("ul");

        expect(listbox).toHaveLength(1);
        expect(listbox.props()["role"]).toEqual("listbox");
    });
    test("should add an `aria-controls` on a text input with the same value as the id of the `listbox`", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const inputAriaControls: string = rendered.find("input").props()["aria-controls"];
        const listboxId: string = rendered.find("ul").props()["id"];

        expect(inputAriaControls).toEqual(listboxId);
    });
    test("should add an `aria-labelledby` on a text input with the same value as the id of the `label`", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const inputAriaLabelledby: string = rendered.find("input").props()[
            "aria-labelledby"
        ];
        const labelId: string = rendered.find("label").props()["id"];

        expect(inputAriaLabelledby).toEqual(labelId);
    });
    test("should have a listbox with an `aria-hidden` attribute set to `true`", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const listbox: any = rendered.find("ul");

        expect(listbox.props()["aria-hidden"]).toEqual(true);
    });
    test("should have a listbox with an `aria-hidden` attribute set to `false` when the button is clicked", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const button: any = rendered.find("button");

        button.simulate("click");

        const listbox: any = rendered.find("ul");

        expect(listbox.props()["aria-hidden"]).toEqual(false);
    });
    test("should generate options based on the `childOptions` provided", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const listboxItems: any = rendered.find("ul li");

        expect(listboxItems).toHaveLength(3);
    });
    test("should generate options based on the `childOptions` provided and filtered by a search term", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
        );
        const input: any = rendered.find("input");

        input.simulate("change", { target: { value: "beta" } });

        const listboxItems: any = rendered.find("ul li");

        expect(listboxItems).toHaveLength(2);
    });
    test("should have a listbox that can be navigated by the `down` key", () => {
        const rendered: any = mount(
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
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

        input.simulate("keydown", { keyCode: KeyCodes.arrowDown });

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

        input.simulate("keydown", { keyCode: KeyCodes.arrowDown });

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

        input.simulate("keydown", { keyCode: KeyCodes.arrowDown });

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
            <FormItemChildren {...childrenProps} managedClasses={managedClasses} />
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

        input.simulate("keydown", { keyCode: KeyCodes.arrowUp });

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

        input.simulate("keydown", { keyCode: KeyCodes.arrowUp });

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

        input.simulate("keydown", { keyCode: KeyCodes.arrowUp });

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
            <FormItemChildren
                {...childrenProps}
                data={{ id: "alpha", props: {} }}
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
            <FormItemChildren
                {...childrenProps}
                data={"hello world"}
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
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={[
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
            <FormItemChildren
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
        expect(callback.mock.calls[0][0]).toEqual("locationOfChildren");
        expect(callback.mock.calls[0][1]).toEqual([{ id: "beta 1", props: {} }]);
    });
    test("should fire a callback to update the data when a default text `option` in the `listbox` is clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemChildren
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
        expect(callback.mock.calls[0][0]).toEqual("locationOfChildren");
        expect(Array.isArray(callback.mock.calls[0][1])).toBe(true);
        expect(typeof callback.mock.calls[0][1][0]).toEqual("string");
    });
    test("should not add a child option to the data when a value has been added to the `input` that is an empty string", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "" } });
        rendered.find("input").simulate("keydown", { keyCode: KeyCodes.enter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should not add a child option to the data when a value has been added to the `input` that does not partially match any of the options", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "echo" } });
        rendered.find("input").simulate("keydown", { keyCode: KeyCodes.enter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should add a child option to the data when a value has been added to the `input` that at least partially matches one of the options", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "b" } });
        rendered.find("input").simulate("keydown", { keyCode: KeyCodes.enter });

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][1]).toEqual([{ id: "beta 1", props: {} }]);
    });
    test("should remove a child option from the data when the remove button has been clicked", () => {
        const callback: any = jest.fn();
        const renderedWithTwoChildren: any = mount(
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={[
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
        expect(callback.mock.calls[0][1]).toEqual(undefined);
        expect(callback.mock.calls[0][2]).toEqual(true);
    });
    test("should show a default indicator if default values exist and no data is available", () => {
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={undefined}
                default={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemChildren_defaultValueIndicator}`)
        ).toHaveLength(1);
    });
    test("should not show a default indicator if data exists", () => {
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={"foo"}
                default={"bar"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formItemChildren_defaultValueIndicator}`)
        ).toHaveLength(0);
    });
    test("should fire the onChange callback to update the data to the default value if the default value indicator is clicked", () => {
        const defaultValue: string = "foo";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={undefined}
                onChange={callback}
                default={defaultValue}
            />
        );

        expect(callback).not.toHaveBeenCalled();

        rendered
            .find(`.${managedClasses.formItemChildren_defaultValueIndicator}`)
            .simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual("locationOfChildren");
        expect(callback.mock.calls[0][1]).toEqual(defaultValue);
    });
    test("should show default values if they exist and no data is available", () => {
        const children: string = "foo";
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={undefined}
                default={children}
            />
        );

        expect(rendered.html().includes(children)).toBe(true);
    });
    test("should not show default values if data exists", () => {
        const children: string = "foo";
        const defaultChildren: string = "bar";
        const rendered: any = mount(
            <FormItemChildren
                {...childrenProps}
                managedClasses={managedClasses}
                data={children}
                default={defaultChildren}
            />
        );
        expect(rendered.html().includes(children)).toBe(true);
        expect(rendered.html().includes(defaultChildren)).toBe(false);
    });
});
