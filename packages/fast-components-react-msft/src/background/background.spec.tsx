import React from "react";
import Background from "./background";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Background", (): void => {
    test("should not throw", (): void => {
        expect(
            (): void => {
                mount(<Background />);
            }
        ).not.toThrow();
    });
    test("should create a div by default", (): void => {
        expect(mount(<Background />).find("div")).toHaveLength(1);
    });
    test("should accept unhandled props", (): void => {
        expect(
            mount(<Background aria-label="wee" />)
                .find("div")
                .prop("aria-label")
        ).toBe("wee");
    });
    test("should allow custom styles", (): void => {
        expect(
            mount(<Background style={{ color: "red" }} />)
                .find("div")
                .prop("style").color
        ).toBe("red");
    });
    test("should create an element from the tag prop", (): void => {
        expect(mount(<Background tag="section" />).find("div")).toHaveLength(0);
        expect(mount(<Background tag="section" />).find("section")).toHaveLength(1);
    });
    test("should apply a background color to the created element", (): void => {
        expect(
            mount(<Background />)
                .find("div")
                .prop("style").backgroundColor
        ).toBe(DesignSystemDefaults.neutralPalette[Background.defaultProps.value]);
    });
    test("should assign a background color directly when it is a string", (): void => {
        expect(
            mount(<Background value="#123" />)
                .find("div")
                .prop("style").backgroundColor
        ).toBe("#123");
    });
    test("should derive index values from the current DesignSystem", (): void => {
        const neutralPalette: string[] = new Array(9)
            .fill(0)
            .map((value: number, index: number) => `#${index}${index}${index}`);

        expect(
            mount(
                <DesignSystemProvider
                    designSystem={{
                        neutralPalette,
                    }}
                >
                    <Background value={8} />
                </DesignSystemProvider>
            )
                .find("div")
                .prop("style").backgroundColor
        ).toBe("#888");
    });
    test("should derive index values from the default design system if no design system is provided", (): void => {
        expect(
            mount(<Background value={8} />)
                .find("div")
                .prop("style").backgroundColor
        ).toBe(DesignSystemDefaults.neutralPalette[8]);
    });
    test("should use default prop values from default design system if no design system and index is out of bounds", (): void => {
        expect(
            mount(<Background value={-1} />)
                .find("div")
                .prop("style").backgroundColor
        ).toBe(DesignSystemDefaults.neutralPalette[Background.defaultProps.value]);
    });
});
