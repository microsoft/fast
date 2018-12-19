import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Children, { FormItemChildrenProps } from "./form-item.children";
import { KeyCodes } from "../../../fast-web-utilities/dist";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const childrenProps: FormItemChildrenProps = {
    key: "key",
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
};

/* tslint:disable:no-string-literal */
describe("Children", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Children {...childrenProps} />);
        }).not.toThrow();
    });
    test("should generate a text input", () => {
        const rendered: any = mount(<Children {...childrenProps} />);

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should add an `aria-autocomplete` with `list` value on a text input", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const input: any = rendered.find("input");

        expect(input.props()["aria-autocomplete"]).toEqual("list");
    });
    test("should generate a button", () => {
        const rendered: any = mount(<Children {...childrenProps} />);

        expect(rendered.find("button")).toHaveLength(1);
    });
    test("should generate a label", () => {
        const rendered: any = mount(<Children {...childrenProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should generate a listbox", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const listbox: any = rendered.find("ul");

        expect(listbox).toHaveLength(1);
        expect(listbox.props()["role"]).toEqual("listbox");
    });
    test("should add an `aria-controls` on a text input with the same value as the id of the `listbox`", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const inputAriaControls: string = rendered.find("input").props()["aria-controls"];
        const listboxId: string = rendered.find("ul").props()["id"];

        expect(inputAriaControls).toEqual(listboxId);
    });
    test("should add an `aria-labelledby` on a text input with the same value as the id of the `label`", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const inputAriaLabelledby: string = rendered.find("input").props()[
            "aria-labelledby"
        ];
        const labelId: string = rendered.find("label").props()["id"];

        expect(inputAriaLabelledby).toEqual(labelId);
    });
    test("should have a listbox with an `aria-hidden` attribute set to `true`", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const listbox: any = rendered.find("ul");

        expect(listbox.props()["aria-hidden"]).toEqual(true);
    });
    test("should have a listbox with an `aria-hidden` attribute set to `false` when the button is clicked", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const button: any = rendered.find("button");

        button.simulate("click");

        const listbox: any = rendered.find("ul");

        expect(listbox.props()["aria-hidden"]).toEqual(false);
    });
    test("should generate options based on the `childOptions` provided", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const listboxItems: any = rendered.find("ul li");

        expect(listboxItems).toHaveLength(3);
    });
    test("should generate options based on the `childOptions` provided and filtered by a search term", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
        const input: any = rendered.find("input");

        input.simulate("change", { target: { value: "beta" } });

        const listboxItems: any = rendered.find("ul li");

        expect(listboxItems).toHaveLength(2);
    });
    test("should have a listbox that can be navigated by the `down` key", () => {
        const rendered: any = mount(<Children {...childrenProps} />);
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
        const rendered: any = mount(<Children {...childrenProps} />);
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
            <Children {...childrenProps} data={{ id: "alpha", props: {} }} />
        );

        expect(
            renderedWithOneChild
                .find("ul")
                .at(0)
                .find("li")
        ).toHaveLength(1);

        const renderedWithTwoChildren: any = mount(
            <Children
                {...childrenProps}
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
            />
        );

        expect(
            renderedWithTwoChildren
                .find("ul")
                .at(0)
                .find("li")
        ).toHaveLength(2);
    });
    test("should fire a callback to update the data when an `option` in the `listbox` is clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(<Children {...childrenProps} onChange={callback} />);

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
    test("should not add a child option to the data when a value has been added to the `input` that is an empty string", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(<Children {...childrenProps} onChange={callback} />);

        rendered.find("input").simulate("change", { target: { value: "" } });
        rendered.find("input").simulate("keydown", { keyCode: KeyCodes.enter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should not add a child option to the data when a value has been added to the `input` that does not partially match any of the options", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(<Children {...childrenProps} onChange={callback} />);

        rendered.find("input").simulate("change", { target: { value: "echo" } });
        rendered.find("input").simulate("keydown", { keyCode: KeyCodes.enter });

        expect(callback).not.toHaveBeenCalled();
    });
    test("should add a child option to the data when a value has been added to the `input` that at least partially matches one of the options", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(<Children {...childrenProps} onChange={callback} />);

        rendered.find("input").simulate("change", { target: { value: "b" } });
        rendered.find("input").simulate("keydown", { keyCode: KeyCodes.enter });

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][1]).toEqual([{ id: "beta 1", props: {} }]);
    });
    test("should remove a child option from the data when the remove button has been clicked", () => {
        const callback: any = jest.fn();
        const renderedWithTwoChildren: any = mount(
            <Children
                {...childrenProps}
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
});
