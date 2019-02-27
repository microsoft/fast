import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTAutoSuggest from "./auto-suggest";
import { AutoSuggestOption } from "../auto-suggest-option";
import {
    AutoSuggest,
    AutoSuggestHandledProps,
    AutoSuggestProps,
    AutoSuggestUnhandledProps,
} from "./index";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const itemA: JSX.Element = <AutoSuggestOption id="a" value="a" />;
const itemB: JSX.Element = <AutoSuggestOption id="b" value="b" />;
const itemC: JSX.Element = <AutoSuggestOption id="c" value="c" />;

describe("button", (): void => {
    const href: string = "https://www.microsoft.com";

    test("should have a displayName that matches the component name", () => {
        expect((MSFTAutoSuggest as any).name).toBe(MSFTAutoSuggest.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTAutoSuggest listboxId="listboxId" />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: AutoSuggestUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(
            <MSFTAutoSuggest listboxId="listboxId" {...unhandledProps} />
        );

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("Custom input region render function is called", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const inputRenderFn: any = jest.fn();
        inputRenderFn.mockReturnValue("Test");
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

    test("default input region attributes are set correctly", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId" label="test-label" disabled={true}>
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        const input: any = rendered.find("input");
        expect(input.prop("aria-label")).toEqual("test-label");
        expect(input.prop("aria-autocomplete")).toEqual("both");
        expect(input.prop("aria-activedescendant")).toEqual(null);
        expect(input.prop("aria-owns")).toEqual(null);
        expect(input.prop("aria-controls")).toEqual(null);
        expect(input.prop("disabled")).toBe(true);
        expect(input.prop("role")).toEqual("combobox");
    });

    test("default input region attributes change correctly as options list navigated", (): void => {
        const rendered: any = mount(
            <AutoSuggest listboxId="listboxId">
                {itemA}
                {itemB}
                {itemC}
            </AutoSuggest>
        );

        let input: any = rendered.find("input");
        input.simulate("keydown", { keyCode: KeyCodes.arrowDown });

        input = rendered.find("input");
        expect(input.prop("aria-owns")).toEqual("listboxId");
        expect(input.prop("aria-controls")).toEqual("listboxId");
        expect(input.prop("aria-activedescendant")).toEqual("a");
    });
});
