import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSBorderRadius from "./border-radius";
import { CSSBorderRadiusClassNameContract } from "./border-radius.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSBorderRadius", () => {
    const managedClasses: CSSBorderRadiusClassNameContract = {
        cssBorderRadius: "cssBorderRadius",
        cssBorderRadius_control: "cssBorderRadius_control",
        cssBorderRadius_input: "cssBorderRadius_input",
        cssBorderRadius_label: "cssBorderRadius_label",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSBorderRadius />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSBorderRadius as any).name).toBe(CSSBorderRadius.displayName);
    });
    test("should use the `data` prop as the input value if the `borderRadius` is provided", () => {
        const borderRadiusValue: string = "#FFF";
        const rendered: any = mount(
            <CSSBorderRadius
                data={{ borderRadius: borderRadiusValue }}
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        expect(
            rendered.find(`.${managedClasses.cssBorderRadius_input}`).prop("value")
        ).toBe(borderRadiusValue);
    });
    test("should fire the `onChange` event if the input value is updated", () => {
        const borderRadiusValue: string = "#FFF";
        const newBorderRadiusValue: string = "#000";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                data={{ borderRadius: borderRadiusValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssBorderRadius_input}`)
            .simulate("change", { target: { value: newBorderRadiusValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ borderRadius: newBorderRadiusValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const borderRadiusValue: string = "#FFF";
        const newBorderRadiusValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                data={{ borderRadius: borderRadiusValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssBorderRadius_input}`)
            .simulate("change", { target: { value: newBorderRadiusValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ borderRadius: newBorderRadiusValue });

        rendered.setProps({
            data: {},
        });

        expect(
            rendered.find(`.${managedClasses.cssBorderRadius_input}`).prop("value")
        ).toBe("");
    });
});
