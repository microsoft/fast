import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSColor from "./color";
import { CSSColorClassNameContract } from "./color.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSColor", () => {
    const managedClasses: CSSColorClassNameContract = {
        cssColor: "cssColor",
        cssColor_colorInputRegion: "cssColor_colorInputRegion",
        cssColor_control: "cssColor_control",
        cssColor_input: "cssColor_input",
        cssColor_label: "cssColor_label",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSColor />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSColor as any).name).toBe(CSSColor.displayName);
    });
    test("should use the `data` prop as the input value if the `color` is provided", () => {
        const colorValue: string = "#FFF";
        const rendered: any = mount(
            <CSSColor
                data={{ color: colorValue }}
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        expect(rendered.find(`.${managedClasses.cssColor_input}`).prop("value")).toBe(
            colorValue
        );
    });
    test("should fire the `onChange` event if the input value is updated", () => {
        const colorValue: string = "#FFF";
        const newColorValue: string = "#000";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSColor
                data={{ color: colorValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssColor_input}`)
            .simulate("change", { target: { value: newColorValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ color: newColorValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const colorValue: string = "#FFF";
        const newColorValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSColor
                data={{ color: colorValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssColor_input}`)
            .simulate("change", { target: { value: newColorValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ color: newColorValue });

        rendered.setProps({
            data: {},
        });

        expect(rendered.find(`.${managedClasses.cssColor_input}`).prop("value")).toBe("");
    });
});
