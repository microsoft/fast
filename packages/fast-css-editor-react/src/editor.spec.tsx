import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Editor from "./editor";
import CSSEditor, { PositionValue, SpacingType } from "./";
import { SpacingProperty } from "./spacing";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSEditor", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<CSSEditor />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((Editor as any).name).toBe(Editor.displayName);
    });
    test("should implement the CSSPosition component", () => {
        const rendered: any = mount(<CSSEditor />);

        expect(rendered.find("CSSPosition").length).toBe(1);
    });
    test("should pass all position props to the CSSPosition component", () => {
        const positionValue: PositionValue = PositionValue.absolute;
        const topValue: string = "1";
        const leftValue: string = "2";
        const bottomValue: string = "3";
        const rightValue: string = "4";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSEditor
                position={positionValue}
                top={topValue}
                left={leftValue}
                bottom={bottomValue}
                right={rightValue}
                onChange={callback}
            />
        );

        const cssPosition: any = rendered.find("CSSPosition");

        expect(cssPosition.prop("position")).toBe(positionValue);
        expect(cssPosition.prop("top")).toBe(topValue);
        expect(cssPosition.prop("left")).toBe(leftValue);
        expect(cssPosition.prop("bottom")).toBe(bottomValue);
        expect(cssPosition.prop("right")).toBe(rightValue);
        expect(typeof cssPosition.prop("onPositionUpdate")).toEqual(typeof Function);
    });
    test("should execute the `onChange` callback to recieve the correct CSSPosition props", () => {
        const updatedPositionValue: string = "5";
        const positionValue: PositionValue = PositionValue.absolute;
        const topValue: string = "1";
        const leftValue: string = "2";
        const callbackPosition: any = jest.fn(
            (args: any): void => {
                expect(args).toEqual({
                    top: updatedPositionValue,
                    position: positionValue,
                    left: leftValue,
                });
            }
        );
        const rendered: any = mount(
            <CSSEditor
                position={positionValue}
                top={topValue}
                left={leftValue}
                onChange={callbackPosition}
            />
        );

        const renderedCSSPosition: any = rendered.find("CSSPosition");
        const topPositionInput: any = renderedCSSPosition.find("input").at(0);
        topPositionInput.simulate("change", {
            target: { value: updatedPositionValue },
        });

        expect(callbackPosition).toHaveBeenCalled();
    });
    test("should pass all position props to the CSSSpacing component", () => {
        const topValue: string = "1";
        const leftValue: string = "2";
        const bottomValue: string = "3";
        const rightValue: string = "4";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSEditor
                spacingType={SpacingType.padding}
                marginTop={topValue}
                marginLeft={leftValue}
                marginBottom={bottomValue}
                marginRight={rightValue}
                paddingTop={topValue}
                paddingLeft={leftValue}
                paddingBottom={bottomValue}
                paddingRight={rightValue}
                onChange={callback}
            />
        );

        const cssPosition: any = rendered.find("CSSSpacing");

        expect(cssPosition.prop("spacingType")).toBe(SpacingType.padding);
        expect(cssPosition.prop(SpacingProperty.marginTop)).toBe(topValue);
        expect(cssPosition.prop(SpacingProperty.marginLeft)).toBe(leftValue);
        expect(cssPosition.prop(SpacingProperty.marginBottom)).toBe(bottomValue);
        expect(cssPosition.prop(SpacingProperty.marginRight)).toBe(rightValue);
        expect(cssPosition.prop(SpacingProperty.paddingTop)).toBe(topValue);
        expect(cssPosition.prop(SpacingProperty.paddingLeft)).toBe(leftValue);
        expect(cssPosition.prop(SpacingProperty.paddingBottom)).toBe(bottomValue);
        expect(cssPosition.prop(SpacingProperty.paddingRight)).toBe(rightValue);
        expect(typeof cssPosition.prop("onSpacingUpdate")).toEqual(typeof Function);
    });
    test("should execute the `onChange` callback to receive the correct CSSSpacing props", () => {
        const updatedSpacingValue: string = "5";
        const topValue: string = "1";
        const leftValue: string = "2";
        const callbackSpacing: any = jest.fn(
            (args: any): void => {
                expect(args).toEqual({
                    paddingLeft: leftValue,
                    paddingTop: updatedSpacingValue,
                });
            }
        );
        const rendered: any = mount(
            <CSSEditor
                spacingType={SpacingType.padding}
                paddingTop={topValue}
                paddingLeft={leftValue}
                onChange={callbackSpacing}
            />
        );

        const renderedCSSSpacing: any = rendered.find("CSSSpacing");
        const topSpacingInput: any = renderedCSSSpacing.find("input").at(0);
        topSpacingInput.simulate("change", {
            target: { value: updatedSpacingValue },
        });

        expect(callbackSpacing).toHaveBeenCalled();
    });
});
