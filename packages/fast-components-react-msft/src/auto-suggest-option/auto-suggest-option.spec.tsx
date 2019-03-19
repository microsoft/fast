import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTAutoSuggestOption from "./auto-suggest-option";
import {
    AutoSuggestOption,
    AutoSuggestOptionHandledProps,
    AutoSuggestOptionUnhandledProps,
} from "./index";
import {
    AutoSuggestContext,
    AutoSuggestContextType,
} from "@microsoft/fast-components-react-base";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("auto suggest option", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTAutoSuggestOption as any).name).toBe(
            MSFTAutoSuggestOption.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTAutoSuggestOption value="test" id="test" />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: AutoSuggestOptionUnhandledProps = {
            "aria-hidden": true,
        };

        const rendered: any = mount(
            <AutoSuggestOption {...unhandledProps} value="test" id="test" />
        );

        expect(rendered.find("div").prop("aria-hidden")).toEqual(true);
    });

    test("Custom display formatter is called", (): void => {
        const displayFormatter: any = jest.fn();
        displayFormatter.mockReturnValue("formatted display");
        const rendered: any = mount(
            <AutoSuggestContext.Provider
                value={{
                    currentValue: "test",
                }}
            >
                <AutoSuggestOption
                    id="testId"
                    value="testValue"
                    displayFormatter={displayFormatter}
                />
            </AutoSuggestContext.Provider>
        );

        expect(displayFormatter).toHaveBeenCalledTimes(1);
    });

    test("Display formatter is not called when disabled in props", (): void => {
        const displayFormatter: any = jest.fn();
        displayFormatter.mockReturnValue("formatted display");
        const rendered: any = mount(
            <AutoSuggestContext.Provider
                value={{
                    currentValue: "test",
                }}
            >
                <AutoSuggestOption
                    formatDisplayString={false}
                    id="testId"
                    value="testValue"
                    displayFormatter={displayFormatter}
                />
            </AutoSuggestContext.Provider>
        );

        expect(displayFormatter).toHaveBeenCalledTimes(0);
    });
});
