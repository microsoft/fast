import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import CSSBorderRadius from "./border-radius";
import { CSSBorderRadiusClassNameContract } from "./border-radius.style";
import { BorderRadiusValue } from "./border-radius.props";

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
    test("should not throw if data is empty", () => {
        expect(() => {
            shallow(<CSSBorderRadius data={{}} />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((CSSBorderRadius as any).name).toBe(CSSBorderRadius.displayName);
    });
    test("should use the `data` prop as the input value if the `borderRadius` is provided", () => {
        const borderRadiusValue: string = "12px 12px 12px 12px";
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
        const borderRadiusValue: string = "12px 12px 12px 12px";
        const newBorderRadiusValue: string = "10px";
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
        const borderRadiusValue: string = "12px 12px 12px 12px";
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

    test("should parse the `data` prop and assign individual values when 1 value is passed", () => {
        const borderRadiusValue: string = "12px";
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue,
            },
        });

        rendered.find("button").simulate("click");

        expect(rendered.find("input").at(0).prop("value")).toBe("12px");
        expect(rendered.find("input").at(1).prop("value")).toBe("12px");
        expect(rendered.find("input").at(2).prop("value")).toBe("12px");
        expect(rendered.find("input").at(3).prop("value")).toBe("12px");
    });

    test("should parse the `data` prop and assign individual values when 2 values are passed", () => {
        const borderRadiusValue: string = "12px 8px";
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue,
            },
        });

        rendered.find("button").simulate("click");

        expect(rendered.find("input").at(0).prop("value")).toBe("12px");
        expect(rendered.find("input").at(1).prop("value")).toBe("8px");
        expect(rendered.find("input").at(2).prop("value")).toBe("12px");
        expect(rendered.find("input").at(3).prop("value")).toBe("8px");
    });

    test("should parse the `data` prop and assign individual values when 3 values are passed", () => {
        const borderRadiusValue: string = "12px 8px 3px";
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue,
            },
        });

        rendered.find("button").simulate("click");

        expect(rendered.find("input").at(0).prop("value")).toBe("12px");
        expect(rendered.find("input").at(1).prop("value")).toBe("8px");
        expect(rendered.find("input").at(2).prop("value")).toBe("3px");
        expect(rendered.find("input").at(3).prop("value")).toBe("8px");
    });

    test("should parse the `data` prop and assign individual values when 4 values are passed", () => {
        const borderRadiusValue: string = "12px 8px 3px 7px";
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue,
            },
        });

        rendered.find("button").simulate("click");

        expect(rendered.find("input").at(0).prop("value")).toBe("12px");
        expect(rendered.find("input").at(1).prop("value")).toBe("8px");
        expect(rendered.find("input").at(2).prop("value")).toBe("3px");
        expect(rendered.find("input").at(3).prop("value")).toBe("7px");
    });

    test("should set the `hasFocus` state when top left input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.find("button").simulate("click");

        rendered.find("input").at(0).simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderTopLeftRadius);
    });

    test("should set the `hasFocus` state when top right input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.find("button").simulate("click");

        rendered.find("input").at(1).simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderTopRightRadius);
    });

    test("should set the `hasFocus` state when bottom right input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.find("button").simulate("click");

        rendered.find("input").at(2).simulate("focus");

        expect(rendered.state("hasFocus")).toBe(
            BorderRadiusValue.borderBottomRightRadius
        );
    });

    test("should set the `hasFocus` state when bottom left input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.find("button").simulate("click");

        rendered.find("input").at(3).simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderBottomLeftRadius);

        rendered.find("input").at(3).simulate("blur");

        expect(rendered.state("hasFocus")).toBe(void 0);
    });

    test("should set the `individualValues` state when input toggle is clicked", () => {
        const rendered: any = mount(
            <CSSBorderRadius managedClasses={managedClasses} onChange={jest.fn()} />
        );

        rendered.find("button").simulate("click");

        expect(rendered.state("individualValues")).toBe(true);
    });

    test("should update top left value on top left value input change", () => {
        const newBorderRadius: string = "10px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={callback}
                data={{ borderRadius: "1px 1px 1px 1px" }}
            />
        );

        rendered.find("button").simulate("click");

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { value: newBorderRadius } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toStrictEqual({
            borderRadius: "10px 1px 1px 1px",
        });
    });

    test("should update top right value on top right value input change", () => {
        const newBorderRadius: string = "10px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={callback}
                data={{ borderRadius: "1px 1px 1px 1px" }}
            />
        );

        rendered.find("button").simulate("click");

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find("input")
            .at(1)
            .simulate("change", { target: { value: newBorderRadius } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toStrictEqual({
            borderRadius: "1px 10px 1px 1px",
        });
    });

    test("should update bottom right value on bottom right value input change", () => {
        const newBorderRadius: string = "10px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={callback}
                data={{ borderRadius: "1px 1px 1px 1px" }}
            />
        );

        rendered.find("button").simulate("click");

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find("input")
            .at(2)
            .simulate("change", { target: { value: newBorderRadius } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toStrictEqual({
            borderRadius: "1px 1px 10px 1px",
        });
    });

    test("should update bottom left value on bottom left value input change", () => {
        const newBorderRadius: string = "10px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={callback}
                data={{ borderRadius: "1px 1px 1px 1px" }}
            />
        );

        rendered.find("button").simulate("click");

        expect(callback).toHaveBeenCalledTimes(0);

        rendered
            .find("input")
            .at(3)
            .simulate("change", { target: { value: newBorderRadius } });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toStrictEqual({
            borderRadius: "1px 1px 1px 10px",
        });
    });
});
