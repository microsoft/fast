import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSBorder from "./border";
import { CSSBorderClassNameContract } from "./border.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSBorder", () => {
    const managedClasses: CSSBorderClassNameContract = {
        cssBorder: "cssBorder",
        cssBorder_borderInputContainer: "cssBorder_borderInputContainer",
        cssBorder_control: "cssBorder_control",
        cssBorder_input: "cssBorder_input",
        cssBorder_label: "cssBorder_label",
        cssBorder_selectControl: "cssBorder_selectControl",
        cssBorder_select: "cssBorder_select",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSBorder />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSBorder as any).name).toBe(CSSBorder.displayName);
    });
    test("should use the `data` prop as the input value if the `borderWidth` is provided", () => {
        const borderWidth: string = "3px";
        const rendered: any = mount(
            <CSSBorder
                data={{ borderWidth }}
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        expect(rendered.find(`.${managedClasses.cssBorder_input}`).prop("value")).toBe(
            borderWidth
        );
    });
});
