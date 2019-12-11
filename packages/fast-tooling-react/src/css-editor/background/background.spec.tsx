import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSBackground from "./background";
import { CSSBackgroundClassNameContract } from "./background.style";
import { CSSBackgroundProps } from "./background.props";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSBackground", () => {
    const managedClasses: CSSBackgroundClassNameContract = {
        cssBackground: "cssBackground",
        cssBackground_control: "cssBackground_control",
        cssBackground__disabled: "cssBackground__disabled",
        cssBackground_input: "cssBackground_input",
    };

    const backgroundProps: CSSBackgroundProps = {
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
            shallow(<CSSBackground {...backgroundProps} />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSBackground as any).name).toBe(CSSBackground.displayName);
    });
    test("should use the `value` prop as the input value if the `background` is provided", () => {
        const backgroundValue: string = "#FFF";
        const rendered: any = mount(
            <CSSBackground
                value={backgroundValue}
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        expect(
            rendered.find(`.${managedClasses.cssBackground_input}`).prop("value")
        ).toBe(backgroundValue);
    });
    test("should fire the `onChange` event if the input value is updated", () => {
        const backgroundValue: string = "#FFF";
        const newBackgroundValue: string = "#000";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBackground
                value={backgroundValue}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssBackground_input}`)
            .simulate("change", { target: { value: newBackgroundValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newBackgroundValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const backgroundValue: string = "#FFF";
        const newBackgroundValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBackground
                value={backgroundValue}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssBackground_input}`)
            .simulate("change", { target: { value: newBackgroundValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newBackgroundValue });

        rendered.setProps({
            value: "",
        });

        expect(
            rendered.find(`.${managedClasses.cssBackground_input}`).prop("value")
        ).toBe("");
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <CSSBackground
                {...backgroundProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find(`.${managedClasses.cssBackground__disabled}`)).toHaveLength(
            1
        );
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
});
