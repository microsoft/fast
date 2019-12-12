import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSHeight from "./height";
import { CSSHeightClassNameContract } from "./height.style";
import { CSSHeightProps } from "./height.props";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSHeight", () => {
    const managedClasses: CSSHeightClassNameContract = {
        cssHeight: "cssHeight",
        cssHeight_input: "cssHeight_input",
        cssHeight__disabled: "cssHeight__disabled",
    };

    const heightProps: CSSHeightProps = {
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
            shallow(<CSSHeight {...heightProps} />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSHeight as any).name).toBe(CSSHeight.displayName);
    });
    test("should use the `value` prop as the input value if the `height` is provided", () => {
        const heightValue: string = "12px";
        const rendered: any = mount(
            <CSSHeight
                managedClasses={managedClasses}
                {...heightProps}
                value={heightValue}
            />
        );

        expect(rendered.find(`.${managedClasses.cssHeight_input}`).prop("value")).toBe(
            heightValue
        );
    });
    test("should fire the `onChange` event if the input value is updated", () => {
        const heightValue: string = "12px";
        const newHeightValue: string = "40px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSHeight
                value={heightValue}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssHeight_input}`)
            .simulate("change", { target: { value: newHeightValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: newHeightValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const heightValue: string = "12px";
        const newHeightValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSHeight
                value={heightValue}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssHeight_input}`)
            .simulate("change", { target: { value: newHeightValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ height: newHeightValue });

        rendered.setProps({
            value: "",
        });

        expect(rendered.find(`.${managedClasses.cssHeight_input}`).prop("value")).toBe(
            ""
        );
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <CSSHeight {...heightProps} disabled={true} managedClasses={managedClasses} />
        );

        expect(rendered.find(`.${managedClasses.cssHeight__disabled}`)).toHaveLength(1);
        expect(
            rendered
                .find("input")
                .at(0)
                .prop("disabled")
        ).toBeTruthy();
    });
});
