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
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue
            },
        });
        rendered.setState({ individualValues: true });

        const inputTopLeft: any = rendered.find("input").at(0);
        const inputTopRight: any = rendered.find("input").at(1);
        const inputBottomRight: any = rendered.find("input").at(2);
        const inputBottomLeft: any = rendered.find("input").at(3);
        
        expect(
            inputTopLeft.prop("value")
        ).toBe("12px");
        expect(
            inputTopRight.prop("value")
        ).toBe("12px");
        expect(
            inputBottomRight.prop("value")
        ).toBe("12px");
        expect(
            inputBottomLeft.prop("value")
        ).toBe("12px");
    });

    test("should parse the `data` prop and assign individual values when 2 values are passed", () => {
        const borderRadiusValue: string = "12px 8px";
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue
            },
        });
        rendered.setState({ individualValues: true });

        const inputTopLeft: any = rendered.find("input").at(0);
        const inputTopRight: any = rendered.find("input").at(1);
        const inputBottomRight: any = rendered.find("input").at(2);
        const inputBottomLeft: any = rendered.find("input").at(3);
        
        expect(
            inputTopLeft.prop("value")
        ).toBe("12px");
        expect(
            inputTopRight.prop("value")
        ).toBe("8px");
        expect(
            inputBottomRight.prop("value")
        ).toBe("12px");
        expect(
            inputBottomLeft.prop("value")
        ).toBe("8px");
    });

    test("should parse the `data` prop and assign individual values when 3 values are passed", () => {
        const borderRadiusValue: string = "12px 8px 3px";
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue
            },
        });
        rendered.setState({ individualValues: true });

        const inputTopLeft: any = rendered.find("input").at(0);
        const inputTopRight: any = rendered.find("input").at(1);
        const inputBottomRight: any = rendered.find("input").at(2);
        const inputBottomLeft: any = rendered.find("input").at(3);      

        expect(
            inputTopLeft.prop("value")
        ).toBe("12px");
        expect(
            inputTopRight.prop("value")
        ).toBe("8px");
        expect(
            inputBottomRight.prop("value")
        ).toBe("3px");
        expect(
            inputBottomLeft.prop("value")
        ).toBe("8px");
    });

    test("should parse the `data` prop and assign individual values when 4 values are passed", () => {
        const borderRadiusValue: string = "12px 8px 3px 7px";
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setProps({
            data: {
                borderRadius: borderRadiusValue
            },
        });
        rendered.setState({ individualValues: true });

        const inputTopLeft: any = rendered.find("input").at(0);
        const inputTopRight: any = rendered.find("input").at(1);
        const inputBottomRight: any = rendered.find("input").at(2);
        const inputBottomLeft: any = rendered.find("input").at(3);
        
        expect(
            inputTopLeft.prop("value")
        ).toBe("12px");
        expect(
            inputTopRight.prop("value")
        ).toBe("8px");
        expect(
            inputBottomRight.prop("value")
        ).toBe("3px");
        expect(
            inputBottomLeft.prop("value")
        ).toBe("7px");
    });

    test("should set the `hasFocus` state when top left input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setState({ individualValues: true });

        const inputTopLeft: any = rendered.find("input").at(0);
        
        inputTopLeft.simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderTopLeftRadius);
    });

    test("should set the `hasFocus` state when top right input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setState({ individualValues: true });

        const inputTopRight: any = rendered.find("input").at(1);
        
        inputTopRight.simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderTopRightRadius);
    });

    test("should set the `hasFocus` state when bottom right input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setState({ individualValues: true });

        const inputBottomRight: any = rendered.find("input").at(2);
        
        inputBottomRight.simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderBottomRightRadius);
    });

    test("should set the `hasFocus` state when bottom left input is focused", () => {
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        rendered.setState({ individualValues: true });

        const inputBottomLeft: any = rendered.find("input").at(3);
        
        inputBottomLeft.simulate("focus");

        expect(rendered.state("hasFocus")).toBe(BorderRadiusValue.borderBottomLeftRadius);
    });

    test("should set the `individualValues` state when input toggle is clicked", () => {
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
            />
        );

        const toggleInputButton: any = rendered.find("button");
        
        toggleInputButton.simulate("click");

        expect(rendered.state("individualValues")).toBe(true);
    });

    xtest("should set the `hasFocus` state when top left input is focused", () => {
        const newBorderRadius: string = "10px";
        const callback: any = jest.fn();
        const rendered: any = mount(
            <CSSBorderRadius
                managedClasses={managedClasses}
                onChange={jest.fn()}
                data={{ borderRadius: "1px 1px 1px 1px" }}

            />
        );

        rendered.setState({ individualValues: true });

        const input: any = rendered.find("input").at(0);
        
        input.simulate("change", { target: { value: newBorderRadius } });

        expect(rendered.state("topLeftValue")).toBe("10px");
        expect(rendered.prop("data")).toBe(
            {borderRadius: "10px 1px 1px 1px"}
        )
    });
});
