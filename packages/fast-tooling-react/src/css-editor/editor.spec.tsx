import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Editor from "./editor";
import { CSSEditor, PositionValue, SpacingType } from "./";
import { SpacingProperty } from "./spacing";
import { CSSEditorValues } from "./editor.props";

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
        const data: CSSEditorValues = {
            position: positionValue,
            top: topValue,
            left: leftValue,
            bottom: bottomValue,
            right: rightValue,
        };
        const rendered: any = mount(<CSSEditor data={data} onUpdate={callback} />);

        const cssPosition: any = rendered.find("CSSPosition");

        expect(cssPosition.prop("data").position).toBe(positionValue);
        expect(cssPosition.prop("data").top).toBe(topValue);
        expect(cssPosition.prop("data").left).toBe(leftValue);
        expect(cssPosition.prop("data").bottom).toBe(bottomValue);
        expect(cssPosition.prop("data").right).toBe(rightValue);
        expect(typeof cssPosition.prop("onUpdate")).toEqual(typeof Function);
    });
    test("should execute the `onUpdate` callback to recieve the correct CSSPosition props", () => {
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
        const data: CSSEditorValues = {
            position: positionValue,
            top: topValue,
            left: leftValue,
        };
        const rendered: any = mount(
            <CSSEditor data={data} onUpdate={callbackPosition} />
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
        const data: CSSEditorValues = {
            marginTop: topValue,
            marginLeft: leftValue,
            marginBottom: bottomValue,
            marginRight: rightValue,
            paddingTop: topValue,
            paddingLeft: leftValue,
            paddingBottom: bottomValue,
            paddingRight: rightValue,
        };

        const rendered: any = mount(<CSSEditor data={data} onUpdate={callback} />);

        const cssPosition: any = rendered.find("CSSSpacing");

        expect(cssPosition.prop("data")[SpacingProperty.marginTop]).toBe(topValue);
        expect(cssPosition.prop("data")[SpacingProperty.marginLeft]).toBe(leftValue);
        expect(cssPosition.prop("data")[SpacingProperty.marginBottom]).toBe(bottomValue);
        expect(cssPosition.prop("data")[SpacingProperty.marginRight]).toBe(rightValue);
        expect(cssPosition.prop("data")[SpacingProperty.paddingTop]).toBe(topValue);
        expect(cssPosition.prop("data")[SpacingProperty.paddingLeft]).toBe(leftValue);
        expect(cssPosition.prop("data")[SpacingProperty.paddingBottom]).toBe(bottomValue);
        expect(cssPosition.prop("data")[SpacingProperty.paddingRight]).toBe(rightValue);
        expect(typeof cssPosition.prop("onUpdate")).toEqual(typeof Function);
    });
    test("should execute the `onUpdate` callback to receive the correct CSSSpacing props", () => {
        const updatedSpacingValue: string = "5";
        const topValue: string = "1";
        const leftValue: string = "2";
        const callbackSpacing: any = jest.fn(
            (args: any): void => {
                expect(args).toEqual({
                    marginLeft: leftValue,
                    marginTop: updatedSpacingValue,
                });
            }
        );
        const data: CSSEditorValues = {
            marginTop: topValue,
            marginLeft: leftValue,
        };
        const rendered: any = mount(<CSSEditor data={data} onUpdate={callbackSpacing} />);

        const renderedCSSSpacing: any = rendered.find("CSSSpacing");
        const topSpacingInput: any = renderedCSSSpacing.find("input").at(0);
        topSpacingInput.simulate("change", {
            target: { value: updatedSpacingValue },
        });

        expect(callbackSpacing).toHaveBeenCalled();
    });
});
