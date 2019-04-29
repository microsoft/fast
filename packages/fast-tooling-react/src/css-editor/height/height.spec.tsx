import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSHeight from "./height";
import { CSSHeightClassNameContract } from "./height.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSHeight", () => {
    const managedClasses: CSSHeightClassNameContract = {
        cssHeight: "cssHeight",
        cssHeight_control: "cssHeight_control",
        cssHeight_input: "cssHeight_input",
        cssHeight_label: "cssHeight_label",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSHeight />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSHeight as any).name).toBe(CSSHeight.displayName);
    });
    test("should use the `height` prop as the input value if the `height` is provided", () => {
        const heightValue: string = "12px";
        const rendered: any = mount(
            <CSSHeight
                data={{ height: heightValue }}
                managedClasses={managedClasses}
                onChange={jest.fn()}
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
                data={{ height: heightValue }}
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
    });
});
