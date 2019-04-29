import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSWidth from "./width";
import { CSSWidthClassNameContract } from "./width.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSWidth", () => {
    const managedClasses: CSSWidthClassNameContract = {
        cssWidth: "cssWidth",
        cssWidth_control: "cssWidth_control",
        cssWidth_input: "cssWidth_input",
        cssWidth_label: "cssWidth_label",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSWidth />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSWidth as any).name).toBe(CSSWidth.displayName);
    });
    test("should use the `width` prop as the input value if the `width` is provided", () => {
        const widthValue: string = "12px";
        const rendered: any = mount(
            <CSSWidth
                data={{ width: widthValue }}
                managedClasses={managedClasses}
                onChange={jest.fn()}
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
                data={{ width: widthValue }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find(`.${managedClasses.cssWidth_input}`)
            .simulate("change", { target: { value: newWidthValue } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ width: newWidthValue });
    });
});
