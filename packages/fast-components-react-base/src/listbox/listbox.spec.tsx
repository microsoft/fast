import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import Listbox, { ListboxUnhandledProps } from "./listbox";
import ListboxItem from "../listbox-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const itemA: JSX.Element = <ListboxItem id="a" value="a" displayString="a" />;
const itemADisabled: JSX.Element = (
    <ListboxItem id="a" value="a" displayString="a" disabled={true} />
);
const itemB: JSX.Element = <ListboxItem id="b" value="b" displayString="ab" />;
const itemC: JSX.Element = <ListboxItem id="c" value="c" displayString="abc" />;

describe("listbox", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Listbox as any).name).toBe(Listbox.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Listbox />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ListboxUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<Listbox {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should not have a focusIndex if no children are focusable", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div>hello world</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(-1);
    });

    test("should set focusIndex to the first focusable element on mount", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div>not a focusable element</div>
                {itemA}
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should not throw with a single focusable child in single select mode", (): void => {
        const rendered: any = mount(<Listbox>{itemA}</Listbox>, {
            attachTo: document.body,
        });

        expect(rendered.state("focusIndex")).toBe(0);
        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(0);
        rendered.childAt(0).simulate("keydown", { key: "a" });
        expect(rendered.state("focusIndex")).toBe(0);
    });

    test("should not throw with a single focusable child in multi select mode", (): void => {
        const rendered: any = mount(<Listbox multiselectable={true}>{itemA}</Listbox>, {
            attachTo: document.body,
        });

        expect(rendered.state("focusIndex")).toBe(0);
        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(0);
        rendered.childAt(0).simulate("keydown", { key: "a" });
        expect(rendered.state("focusIndex")).toBe(0);
    });

    test("should move focus down when the down arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should move focus down when the right arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowRight });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should move focus up when the up arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
            </Listbox>,
            { attachTo: document.body }
        );

        rendered.setState({ focusIndex: 1 });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("focusIndex")).toBe(0);
    });

    test("should move focus up when the left arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
            </Listbox>,
            { attachTo: document.body }
        );

        rendered.setState({ focusIndex: 1 });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("focusIndex")).toBe(0);
    });

    test("should move focus the last focusable element when the end key is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
                {itemC}
                <div>four</div>
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.end });
        expect(rendered.state("focusIndex")).toBe(2);
    });

    test("should move focus the first focusable element when the home key is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div>one</div>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        rendered.setState({ focusIndex: 3 });
        expect(rendered.state("focusIndex")).toBe(3);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.home });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should not place focus any child without a the proper role", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div />
                {itemA}
                <div />
                {itemB}
                <div />
                {itemC}
                <div />
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(3);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(5);
    });

    test("should move focus to matching items as characters are typed", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
                {itemC}
                <div>four</div>
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "a" });
        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "b" });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { key: "c" });
        expect(rendered.state("focusIndex")).toBe(2);

        rendered.childAt(0).simulate("keydown", { key: "d" });
        expect(rendered.state("focusIndex")).toBe(2);
    });

    test("changing the typeahead property key should work", (): void => {
        const rendered: any = mount(
            <Listbox typeAheadPropertyKey="value">
                {itemA}
                {itemB}
                {itemC}
                <div>four</div>
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "c" });
        expect(rendered.state("focusIndex")).toBe(2);

        rendered.childAt(0).simulate("keydown", { key: "d" });
        expect(rendered.state("focusIndex")).toBe(2);
    });

    test("should not move focus if characters are typed that don't have matches", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
                {itemC}
                <div>four</div>
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "a" });
        rendered.childAt(0).simulate("keydown", { key: "b" });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { key: "x" });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("aria-activedescendant value should change with focus changes", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.childAt(0).prop("aria-activedescendant")).toBe("");

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.childAt(0).prop("aria-activedescendant")).toBe("b");
    });

    test("aria-multiselectable value should be true when in multi-select mode", (): void => {
        const rendered: any = mount(<Listbox multiselectable={true} />);
        expect(rendered.childAt(0).prop("aria-multiselectable")).toBe(true);
    });

    test("should move selection with focus in single select mode", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        let element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        element = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("false");
    });

    test("should not move selection with focus in multiple select mode", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("selectedItems").length).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("selectedItems").length).toBe(0);
    });

    test("should toggle selection with arrow key navigation in multiple select mode when shift key pressed", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered
            .childAt(0)
            .simulate("keydown", { keyCode: KeyCodes.arrowDown, shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        let element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .simulate("keydown", { keyCode: KeyCodes.arrowUp, shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(2);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        expect(rendered.state("selectedItems")[1].id).toBe("b");
        element = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .simulate("keydown", { keyCode: KeyCodes.arrowDown, shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        element = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("should move selection on click in single select mode", (): void => {
        const rendered: any = mount(
            <Listbox>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered
            .childAt(0)
            .childAt(0)
            .simulate("click");
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        let element: HTMLElement = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(1)
            .simulate("click");
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("should move selection on click in multi select mode", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered
            .childAt(0)
            .childAt(0)
            .simulate("click");
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        let element: HTMLElement = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(1)
            .simulate("click");
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("ctlr click in multi select mode should toggle clicked selection but keep others", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered
            .childAt(0)
            .childAt(1)
            .simulate("click");
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        let element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(0)
            .simulate("click", { ctrlKey: true });
        expect(rendered.state("selectedItems").length).toBe(2);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        expect(rendered.state("selectedItems")[1].id).toBe("b");
        element = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(0)
            .simulate("click", { ctrlKey: true });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        element = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("false");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("shift click in multi select mode should select a range", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered
            .childAt(0)
            .childAt(1)
            .simulate("click");
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        let element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(0)
            .simulate("click", { shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(2);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        expect(rendered.state("selectedItems")[1].id).toBe("b");
        element = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(2)
            .simulate("click", { shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(2);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        expect(rendered.state("selectedItems")[1].id).toBe("c");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("c");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("should select a range and move focus to the end when ctrl-shift-end is pressed in multi-select mode", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(1);
        expect(rendered.state("selectedItems").length).toBe(0);

        rendered.childAt(0).simulate("keydown", {
            keyCode: KeyCodes.end,
            shiftKey: true,
            ctrlKey: true,
        });
        expect(rendered.state("focusIndex")).toBe(2);
        expect(rendered.state("selectedItems").length).toBe(2);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        expect(rendered.state("selectedItems")[1].id).toBe("c");
        let element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("c");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("should select a range and move focus to beginning when ctrl-shift-home is pressed in multi-select mode", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(1);
        expect(rendered.state("selectedItems").length).toBe(0);

        rendered.childAt(0).simulate("keydown", {
            keyCode: KeyCodes.home,
            shiftKey: true,
            ctrlKey: true,
        });
        expect(rendered.state("focusIndex")).toBe(0);
        expect(rendered.state("selectedItems").length).toBe(2);
        expect(rendered.state("selectedItems")[0].id).toBe("a");
        expect(rendered.state("selectedItems")[1].id).toBe("b");
        let element: HTMLElement = document.getElementById("a");
        expect(element.getAttribute("aria-selected")).toBe("true");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("Shift-a should select entire list in multi select mode", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "A", shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(3);
    });

    test("Setting selected items in props (controlled mode) should override selections made in ui", (): void => {
        const rendered: any = mount(
            <Listbox selectedItems={["b"]}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        let element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered.childAt(0).simulate("keydown", { key: "a" });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");

        rendered
            .childAt(0)
            .childAt(2)
            .simulate("click", { shiftKey: true });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        element = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("Setting default selection should work", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true} defaultSelection={["b"]}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
        const element: HTMLElement = document.getElementById("b");
        expect(element.getAttribute("aria-selected")).toBe("true");
    });

    test("Invalid default items should be culled from the list", (): void => {
        const rendered: any = mount(
            <Listbox multiselectable={true} defaultSelection={["a", "b", "z"]}>
                {itemADisabled}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
    });

    test("In single select mode only the first valid default item should be selected", (): void => {
        const rendered: any = mount(
            <Listbox defaultSelection={["z", "a", "b"]}>
                {itemADisabled}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
    });

    test("should call a registered callback after selection change", (): void => {
        const onSelectedItemsChanged: any = jest.fn();
        const rendered: any = mount(
            <Listbox onSelectedItemsChanged={onSelectedItemsChanged}>
                {itemA}
                {itemB}
                {itemC}
            </Listbox>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);
        expect(onSelectedItemsChanged).toHaveBeenCalledTimes(0);
        rendered
            .childAt(0)
            .childAt(0)
            .simulate("click");
        expect(onSelectedItemsChanged).toHaveBeenCalledTimes(1);
        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(onSelectedItemsChanged).toHaveBeenCalledTimes(2);
    });
});
