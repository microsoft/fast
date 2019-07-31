import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSBackground from "./background";
import { CSSBackgroundClassNameContract } from "./background.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSBackground", () => {
    const managedClasses: CSSBackgroundClassNameContract = {
        cssBackground: "cssBackground",
        cssBackground_colorInputRegion: "cssBackground_colorInputRegion",
        cssBackground_control: "cssBackground_control",
        cssBackground_input: "cssBackground_input",
        cssBackground_label: "cssBackground_label",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSBackground />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSBackground as any).name).toBe(CSSBackground.displayName);
    });
    test("should use the `data` prop as the input value if the `background` is provided", () => {
        const backgroundValue: string = "#FFF";
        const rendered: any = mount(
            <CSSBackground
                data={{ background: backgroundValue }}
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
                data={{ background: backgroundValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssBackground_input}`)
            .simulate("change", { target: { value: newBackgroundValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ background: newBackgroundValue });
    });
    test("should not change the input from controlled to uncontrolled", () => {
        const backgroundValue: string = "#FFF";
        const newBackgroundValue: string = void 0;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBackground
                data={{ background: backgroundValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssBackground_input}`)
            .simulate("change", { target: { value: newBackgroundValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ background: newBackgroundValue });

        rendered.setProps({
            data: {},
        });

        expect(
            rendered.find(`.${managedClasses.cssBackground_input}`).prop("value")
        ).toBe("");
    });
});
