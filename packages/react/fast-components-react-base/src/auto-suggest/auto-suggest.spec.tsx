import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper, shallow } from "enzyme";
import {
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeColon,
    keyCodeEnter,
    keyCodeEscape,
    keyCodeTab,
} from "@microsoft/fast-web-utilities";
import ListboxItem from "../listbox-item";
import { DisplayNamePrefix } from "../utilities";
import { Listbox } from "../index";
import AutoSuggest, { AutoSuggestUnhandledProps } from "./auto-suggest";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const itemA: JSX.Element = <ListboxItem id="a" value="a" />;
const itemB: JSX.Element = <ListboxItem id="b" value="b" />;
const itemC: JSX.Element = <ListboxItem id="c" value="c" />;

describe("auto suggest", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(AutoSuggest as any).name}`).toBe(
            AutoSuggest.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<AutoSuggest listboxId="listboxId" />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: AutoSuggestUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(
            <AutoSuggest listboxId="listboxId" {...unhandledProps} />
        );

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("initial default state is correct", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        expect(rendered.state("value")).toBe("");
        expect(rendered.state("focusedItem")).toBe(null);
        expect(rendered.state("isMenuOpen")).toBe(false);
    });

    test("value prop is applied", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" value="test value">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        expect(rendered.state("value")).toBe("test value");
    });

    test("input region accessibility attributes are set correctly (autocomplete='both', )", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        const input: any = rendered.find("input");
        expect(input.prop("aria-autocomplete")).toEqual("both");
        expect(input.prop("role")).toEqual("combobox");
    });

    test("input region gets label applied from props", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" label="test-label">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        const input: any = rendered.find("input");
        expect(input.prop("aria-label")).toEqual("test-label");
    });

    test("input region is disabled when component is disabled", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" disabled={true}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        const input: any = rendered.find("input");
        expect(input.prop("disabled")).toBe(true);
    });

    test("input region 'aria-owns' and 'aria-controls' attributes are null by default and point to listbox id when listbox is open", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        let input: any = rendered.find("input");
        expect(input.prop("aria-owns")).toBe(null);
        expect(input.prop("aria-controls")).toBe(null);
        expect(input.prop("aria-activedescendant")).toBe(null);
        input.simulate("keydown", { keyCode: keyCodeArrowDown });

        input = rendered.find("input");
        expect(input.prop("aria-owns")).toEqual("listboxId");
        expect(input.prop("aria-controls")).toEqual("listboxId");
        expect(input.prop("aria-activedescendant")).toEqual("a");

        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowDown });
        input = rendered.find("input");
        expect(input.prop("aria-owns")).toEqual("listboxId");
        expect(input.prop("aria-controls")).toEqual("listboxId");
        expect(input.prop("aria-activedescendant")).toEqual("b");

        document.body.removeChild(container);
    });

    test("input region 'aria-owns' and 'aria-controls' attributes are null by default and point to listbox id when listbox is open", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        let input: any = rendered.find("input");
        expect(input.prop("aria-owns")).toBe(null);
        expect(input.prop("aria-controls")).toBe(null);
        input.simulate("keydown", { keyCode: keyCodeArrowDown });

        input = rendered.find("input");
        expect(input.prop("aria-owns")).toEqual("listboxId");
        expect(input.prop("aria-controls")).toEqual("listboxId");

        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowDown });
        input = rendered.find("input");
        expect(input.prop("aria-owns")).toEqual("listboxId");
        expect(input.prop("aria-controls")).toEqual("listboxId");

        document.body.removeChild(container);
    });

    test("input region 'aria-activedescendant' is initially null and tracks focused item in listbox", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        let input: any = rendered.find("input");
        expect(input.prop("aria-activedescendant")).toBe(null);
        input.simulate("keydown", { keyCode: keyCodeArrowDown });

        input = rendered.find("input");
        expect(input.prop("aria-activedescendant")).toEqual("a");

        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowDown });
        input = rendered.find("input");
        expect(input.prop("aria-activedescendant")).toEqual("b");

        document.body.removeChild(container);
    });

    test("menu should open and have correct id on input region click", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        let input: any = rendered.find("input");
        expect(input.prop("aria-expanded")).toBe(false);

        expect(rendered.state("isMenuOpen")).toBe(false);
        input.simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(true);

        input = rendered.find("input");
        expect(input.prop("aria-expanded")).toBe(true);

        const listbox: any = rendered.find('[role="listbox"]');
        expect(listbox.prop("id")).toBe("listboxId");
    });

    test("menu should close when the component loses focus", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        // const autoSuggest: any = rendered.find(AutoSuggest.displayName);
        expect(rendered.state("isMenuOpen")).toBe(false);
        let input: any = rendered.find("input");
        expect(input.prop("aria-expanded")).toBe(false);

        input.simulate("click");
        expect(rendered.state("isMenuOpen")).toBe(true);

        input = rendered.find("input");
        expect(input.prop("aria-expanded")).toBe(true);

        input.simulate("blur");
        expect(rendered.state("isMenuOpen")).toBe(false);

        input = rendered.find("input");
        expect(input.prop("aria-expanded")).toBe(false);
    });

    // Test is incompatible with Jest 25.x, refer to issue #2882
    xtest("arrow keys properly traverse the listbox and input region and cause focus and value to changes appropriately", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" initialValue="search">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );
        const input: any = rendered.find("input");
        expect(document.activeElement.id).toBe("");
        expect(rendered.state("value")).toEqual("search");
        input.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect(document.activeElement.id).toBe("a");
        expect(rendered.state("value")).toEqual("a");
        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowDown });
        expect(document.activeElement.id).toBe("b");
        expect(rendered.state("value")).toEqual("b");
        rendered
            .find({ id: "b" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowDown });
        expect(document.activeElement.id).toBe("c");
        expect(rendered.state("value")).toEqual("c");
        rendered
            .find({ id: "c" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowDown });
        expect(document.activeElement.id).toBe("");
        expect(rendered.state("value")).toEqual("search");
        input.simulate("keydown", { keyCode: keyCodeArrowUp });
        expect(document.activeElement.id).toBe("c");
        expect(rendered.state("value")).toEqual("c");
        rendered
            .find({ id: "c" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowUp });
        expect(document.activeElement.id).toBe("b");
        expect(rendered.state("value")).toEqual("b");
        rendered
            .find({ id: "b" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowUp });
        expect(document.activeElement.id).toBe("a");
        expect(rendered.state("value")).toEqual("a");
        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeArrowUp });
        expect(document.activeElement.id).toBe("");
        expect(rendered.state("value")).toEqual("search");

        document.body.removeChild(container);
    });

    test("onValueChanged event handler called when text changes in input region", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const onValueChange: any = jest.fn();
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" onValueChange={onValueChange}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        expect(onValueChange).toHaveBeenCalledTimes(0);
        const input: any = rendered.find("input");
        input.simulate("keydown", { keyCode: keyCodeColon });
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][1]).toEqual(false);
        document.body.removeChild(container);
    });

    test("onValueChanged event handler called with 'isFromSuggestedOption' flag when focus changes in menu", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const onValueChange: any = jest.fn();
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" onValueChange={onValueChange}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        expect(onValueChange).toHaveBeenCalledTimes(0);
        expect(rendered.state("value")).toBe("");
        const input: any = rendered.find("input");
        input.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect(rendered.state("value")).toBe("a");
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][1]).toEqual(true);

        document.body.removeChild(container);
    });

    test("onInvoked event handler called on keydown of list item", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const onInvoked: any = jest.fn();
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" onInvoked={onInvoked}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        expect(onInvoked).toHaveBeenCalledTimes(0);
        const input: any = rendered.find("input");
        input.simulate("keydown", { keyCode: keyCodeArrowDown });
        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeEnter });
        expect(onInvoked).toHaveBeenCalledTimes(1);

        document.body.removeChild(container);
    });

    test("onInvoked event handler called on keydown of input element", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const onInvoked: any = jest.fn();
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" onInvoked={onInvoked}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        expect(onInvoked).toHaveBeenCalledTimes(0);
        const input: any = rendered.find("input");
        input.simulate("keydown", { keyCode: keyCodeEnter });
        expect(onInvoked).toHaveBeenCalledTimes(1);

        document.body.removeChild(container);
    });

    test("intialValue prop applied correctly", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" initialValue="test">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );
        expect(rendered.state("value")).toBe("test");

        document.body.removeChild(container);
    });

    test("Custom input region render function is called", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const inputRenderFn: any = jest.fn();
        inputRenderFn.mockReturnValue("Test");
        /* eslint-disable-next-line */
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" inputRegion={inputRenderFn}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );
        expect(inputRenderFn).toHaveBeenCalledTimes(1);

        document.body.removeChild(container);
    });

    test("Default tab behaviour is not modified in controlled mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.append(container);

        const onInvoked: jest.Mock = jest.fn();
        const onValueChange: jest.Mock = jest.fn();
        const rendered: ReactWrapper = mount(
            <AutoSuggest
                listboxId="listboxId"
                onInvoked={onInvoked}
                onValueChange={onValueChange}
                value={"controlled value"}
            >
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );

        const input: ReactWrapper = rendered.find("input");
        const preventDefault: jest.Mock = jest.fn();
        input.simulate("keydown", { keyCode: keyCodeTab, preventDefault });

        expect(onInvoked).not.toHaveBeenCalled(); // Invoke should not be called
        expect(onValueChange).not.toHaveBeenCalled(); // Value change should not be called
        expect(preventDefault).not.toHaveBeenCalled(); // Default behavior should not be prevented

        document.body.removeChild(container);
    });

    test("Should render none listbox item when filterSuggestions id set to true", (): void => {
        const rendered: any = mount(
            <AutoSuggest
                listboxId="listboxId"
                isMenuOpen={true}
                initialValue="a"
                filterSuggestions={true}
            >
                {itemA}
                {itemB}
                {itemC}
                <button>Test</button>
            </AutoSuggest>
        );

        expect(rendered.find(Listbox.displayName).get(0).props.children).toHaveLength(2);
    });

    test("closing menu focuses on input element", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" initialValue="search">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>,
            { attachTo: container }
        );
        const input: any = rendered.find("input");
        expect(document.activeElement.id).toBe("");
        expect(rendered.state("value")).toEqual("search");
        input.simulate("keydown", { keyCode: keyCodeArrowDown });
        expect(document.activeElement.id).toBe("a");
        rendered
            .find({ id: "a" })
            .find(ListboxItem.displayName)
            .simulate("keydown", { keyCode: keyCodeEscape });
        expect(document.activeElement.getAttribute("role")).toBe("combobox");
        document.body.removeChild(container);
    });
});
