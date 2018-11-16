import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Editor from "./editor";
import CSSEditor, { PositionValue } from "./";

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
                onPositionUpdate={callback}
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
});
