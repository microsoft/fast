import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSColor from "./color";
import { CSSColorClassNameContract } from "./color.style";
import { CSSColorProps } from "./color.props";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSColor", () => {
    const managedClasses: CSSColorClassNameContract = {
        cssColor: "cssColor-class",
        cssColor__disabled: "cssColor__disabled-class",
        cssColor_colorInputRegion: "cssColor_colorInputRegion-class",
        cssColor_input: "cssColor_input-class",
    };

    const colorProps: CSSColorProps = {
        dataLocation: "",
        onChange: jest.fn(),
        value: "",
        disabled: false,
        reportValidity: jest.fn(),
        updateValidity: jest.fn(),
        elementRef: null,
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSColor {...colorProps} />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSColor as any).name).toBe(CSSColor.displayName);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <CSSColor {...colorProps} disabled={true} managedClasses={managedClasses} />
        );

        expect(rendered.find(`.${managedClasses.cssColor__disabled}`)).toHaveLength(1);
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("disabled")
        ).toBeTruthy();
        expect(
            rendered
                .find("input")
                .at(1)
                .prop("disabled")
        ).toBeTruthy();
    });
    test("should use the `data` prop as the input value if the `color` is provided", () => {
        const colorValue: string = "#FFF";
        const rendered: any = mount(
            <CSSColor
                {...colorProps}
                value={colorValue}
                managedClasses={managedClasses}
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
                {...colorProps}
                value={colorValue}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssColor_input}`)
            .simulate("change", { target: { value: newColorValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newColorValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const colorValue: string = "#FFF";
        const newColorValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSColor
                {...colorProps}
                value={colorValue}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssColor_input}`)
            .simulate("change", { target: { value: newColorValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newColorValue });

        rendered.setProps({
            value: "",
        });

        expect(rendered.find(`.${managedClasses.cssColor_input}`).prop("value")).toBe("");
    });
});
