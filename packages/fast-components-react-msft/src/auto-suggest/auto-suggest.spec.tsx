import React from "react";
import Adapter from "enzyme-adapter-react-16";
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
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const itemA: JSX.Element = <AutoSuggestOption id="a" value="a" />;
const itemB: JSX.Element = <AutoSuggestOption id="b" value="b" />;
const itemC: JSX.Element = <AutoSuggestOption id="c" value="c" />;

describe("auto suggest", (): void => {
    const href: string = "https://www.microsoft.com";

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTAutoSuggest as any).name}`).toBe(
            MSFTAutoSuggest.displayName
        );
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
        input.simulate("keydown", { keyCode: KeyCodes.enter });
        expect(onInvoked).toHaveBeenCalledTimes(1);

        document.body.removeChild(container);
    });
});
