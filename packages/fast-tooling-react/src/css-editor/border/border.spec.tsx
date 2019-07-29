import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { BorderStyleValue } from "./border.props";
import CSSBorder from "./border";
import { CSSBorderClassNameContract } from "./border.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSBorder", () => {
    const managedClasses: CSSBorderClassNameContract = {
        cssBorder: "cssBorder",
        cssBorder_colorInputRegion: "cssBorder_colorInputRegion",
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
    test("should call onChange when state updates", () => {
        const borderWidth: string = "3px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorder
                data={{ borderWidth }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered.setState({ borderWidth: "10px" });

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should set borderColor state in onChange event", () => {
        const borderColor: string = "#000";
        const newBorderColor: string = "#FFF";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorder
                data={{ borderColor }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(rendered.state("borderColor")).toBe(borderColor);

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { value: newBorderColor } });

        expect(rendered.state("borderColor")).toBe(newBorderColor);
    });

    test("should set borderStyle state in onChange event", () => {
        const borderStyle: BorderStyleValue = BorderStyleValue.solid;
        const newBorderStyle: BorderStyleValue = BorderStyleValue.dotted;
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorder
                data={{ borderStyle }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(rendered.state("borderStyle")).toBe(borderStyle);

        rendered
            .find(`.${managedClasses.cssBorder_select}`)
            .simulate("change", { target: { value: newBorderStyle } });

        expect(rendered.state("borderStyle")).toBe(newBorderStyle);
    });

    test("should set borderWidth state in onChange event", () => {
        const borderWidth: string = "1px";
        const newBorderWidth: string = "10px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorder
                data={{ borderWidth }}
                managedClasses={managedClasses}
                onChange={callback}
            />
        );

        expect(rendered.state("borderWidth")).toBe(borderWidth);

        rendered
            .find(`.${managedClasses.cssBorder_input}`)
            .simulate("change", { target: { value: newBorderWidth } });

        expect(rendered.state("borderWidth")).toBe(newBorderWidth);
    });
});
