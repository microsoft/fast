import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSWidth from "./width";
import { CSSWidthClassNameContract } from "./width.style";
import { CSSWidthProps } from "../width";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSWidth", () => {
    const managedClasses: CSSWidthClassNameContract = {
        cssWidth: "cssWidth",
        cssWidth_input: "cssWidth_input",
        cssWidth__disabled: "cssWidth__disabled",
    };

    const widthProps: CSSWidthProps = {
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
            shallow(<CSSWidth {...widthProps} />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSWidth as any).name).toBe(CSSWidth.displayName);
    });
    test("should use the `value` prop as the input value if the `width` is provided", () => {
        const widthValue: string = "12px";
        const rendered: any = mount(
            <CSSWidth
                managedClasses={managedClasses}
                {...widthProps}
                value={widthValue}
            />
        );

        expect(rendered.find(`.${managedClasses.cssWidth_input}`).prop("value")).toBe(
            widthValue
        );
    });
    test("should fire the `onChange` event if the input value is updated", () => {
        const widthValue: string = "12px";
        const newWidthValue: string = "40px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSWidth
                value={widthValue}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssWidth_input}`)
            .simulate("change", { target: { value: newWidthValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newWidthValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const widthValue: string = "12px";
        const newWidthValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSWidth
                value={widthValue}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssWidth_input}`)
            .simulate("change", { target: { value: newWidthValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newWidthValue });

        rendered.setProps({
            value: "",
        });

        expect(rendered.find(`.${managedClasses.cssWidth_input}`).prop("value")).toBe("");
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <CSSWidth {...widthProps} disabled={true} managedClasses={managedClasses} />
        );

        expect(rendered.find(`.${managedClasses.cssWidth__disabled}`)).toHaveLength(1);
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("disabled")
        ).toBeTruthy();
    });
});
