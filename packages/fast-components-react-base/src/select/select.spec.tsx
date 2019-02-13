import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import Select, { SelectUnhandledProps } from "./select";
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

describe("select", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Select as any).name).toBe(Select.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Select />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: SelectUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<Select {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("no items should be selected by default", (): void => {
        const rendered: any = mount(
            <Select>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        expect(rendered.state("selectedItems").length).toBe(0);
    });

    test("menu should open and close on select click in single mode and aria-expanded is set properly", (): void => {
        const rendered: any = mount(
            <Select>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        expect(rendered.state("selectedItems").length).toBe(0);
        expect(rendered.state("isMenuOpen")).toBe(false);
        expect(rendered.find("button").prop("aria-expanded")).toEqual(false);
        rendered.simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(true);
        expect(rendered.find("button").prop("aria-expanded")).toEqual(true);

        rendered.find('[displayString="a"]').simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(false);
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.find("button").prop("aria-expanded")).toEqual(false);
    });

    test("menu should be open by default in multi mode and should remain so during selection", (): void => {
        const rendered: any = mount(
            <Select multiselectable={true}>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );
        expect(rendered.state("isMenuOpen")).toBe(true);
        expect(rendered.state("selectedItems").length).toBe(0);
        rendered.find('[displayString="a"]').simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(true);
        expect(rendered.state("selectedItems").length).toBe(1);
    });

    test("provided callback function is called and value changes when selection changes", (): void => {
        const onValueChange: any = jest.fn();
        const rendered: any = mount(
            <Select onValueChange={onValueChange} defaultSelection={["b"]}>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        expect(rendered.state("selectedItems").length).toBe(1);
        expect(onValueChange).toHaveBeenCalledTimes(1);

        rendered.simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(true);

        rendered
            .find('[displayString="a"]')
            .simulate("keydown", { keyCode: KeyCodes.space });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(onValueChange).toHaveBeenCalledTimes(2);
    });

    test("provided callback function is not called when selected item is reselected", (): void => {
        const onValueChange: any = jest.fn();
        const rendered: any = mount(
            <Select onValueChange={onValueChange} defaultSelection={["b"]}>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        expect(rendered.state("selectedItems").length).toBe(1);
        expect(onValueChange).toHaveBeenCalledTimes(1);

        rendered.simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(true);

        rendered
            .find('[displayString="ab"]')
            .simulate("keydown", { keyCode: KeyCodes.space });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    test("Arrow keys open menu and increment selection in single select mode", (): void => {
        const rendered: any = mount(
            <Select>
                {itemA}
                {itemB}
                {itemC}
            </Select>,
            { attachTo: document.body }
        );

        expect(rendered.state("selectedItems").length).toBe(0);
        expect(rendered.state("isMenuOpen")).toBe(false);

        rendered.simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("isMenuOpen")).toBe(true);
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("a");

        rendered
            .find('[displayString="a"]')
            .simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");

        rendered
            .find('[displayString="ab"]')
            .simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("c");

        rendered
            .find('[displayString="abc"]')
            .simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("c");

        rendered
            .find('[displayString="abc"]')
            .simulate("keydown", { keyCode: KeyCodes.space });
        expect(rendered.state("isMenuOpen")).toBe(false);

        rendered.simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("isMenuOpen")).toBe(true);
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("b");
    });

    test("Arrow up with no selection opens menu and select last item in single select mode", (): void => {
        const rendered: any = mount(
            <Select>
                {itemA}
                {itemB}
                {itemC}
            </Select>
        );

        expect(rendered.state("selectedItems").length).toBe(0);
        expect(rendered.state("isMenuOpen")).toBe(false);

        rendered.simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("isMenuOpen")).toBe(true);
        expect(rendered.state("selectedItems").length).toBe(1);
        expect(rendered.state("selectedItems")[0].id).toBe("c");
    });

    test("Default displaystring and value strings are correct", (): void => {
        const rendered: any = mount(
            <Select multiselectable={true} name="test">
                {itemA}
                {itemB}
                {itemC}
            </Select>,
            { attachTo: document.body }
        );

        expect(rendered.state("displayString")).toBe("");
        expect(rendered.state("value")).toBe("");

        rendered
            .find('[displayString="a"]')
            .simulate("keydown", { keyCode: KeyCodes.space });
        expect(rendered.state("displayString")).toBe("a");
        expect(rendered.state("value")).toBe("test=a");

        rendered
            .find('[displayString="a"]')
            .simulate("keydown", { keyCode: KeyCodes.arrowDown, shiftKey: true });
        expect(rendered.state("displayString")).toBe("a, ab");
        expect(rendered.state("value")).toBe("test=a&test=b");
    });

    test("Custom value and display formatters are called", (): void => {
        const valueFormatter: any = jest.fn();
        valueFormatter.mockReturnValue("formatted values");
        const displayFormatter: any = jest.fn();
        displayFormatter.mockReturnValue("formatted display");
        const rendered: any = mount(
            <Select
                displayStringFormatterFunction={displayFormatter}
                dataValueFormatterFunction={valueFormatter}
            >
                {itemA}
                {itemB}
                {itemC}
            </Select>,
            { attachTo: document.body }
        );

        expect(valueFormatter).toHaveBeenCalledTimes(1);
        expect(displayFormatter).toHaveBeenCalledTimes(1);

        rendered.simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(valueFormatter).toHaveBeenCalledTimes(2);
        expect(displayFormatter).toHaveBeenCalledTimes(2);
    });

    test("Custom display render function is called", (): void => {
        const displayRenderFn: any = jest.fn();
        displayRenderFn.mockReturnValue("Test");
        const rendered: any = mount(
            <Select contentDisplayRenderFunction={displayRenderFn}>
                {itemA}
                {itemB}
                {itemC}
            </Select>,
            { attachTo: document.body }
        );
        expect(displayRenderFn).toHaveBeenCalledTimes(2);
    });

    test("Hidden select element exists and it's value and props are populated", (): void => {
        const rendered: any = mount(
            <Select
                multiselectable={true}
                name="testName"
                form="testForm"
                required={true}
            >
                {itemA}
                {itemB}
                {itemC}
            </Select>,
            { attachTo: document.body }
        );

        const select: any = rendered.find("select");
        expect(select.prop("value")).toBe("");
        expect(select.prop("multiple")).toBe(true);
        expect(select.prop("required")).toBe(true);
        expect(select.prop("name")).toBe("testName");
        expect(select.prop("form")).toBe("testForm");

        rendered
            .find('[displayString="a"]')
            .simulate("keydown", { keyCode: KeyCodes.space });
        expect(rendered.find("select").prop("value")).toBe("testName=a");

        rendered
            .find('[displayString="a"]')
            .simulate("keydown", { keyCode: KeyCodes.arrowDown, shiftKey: true });
        expect(rendered.find("select").prop("value")).toBe("testName=a&testName=b");
    });
});
