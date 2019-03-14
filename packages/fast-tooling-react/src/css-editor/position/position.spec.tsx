import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import BaseCSSPosition from "./position";
import { CSSPosition } from "./";
import { CSSPositionValues, PositionValue } from "./position.props";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSPosition", () => {
    const topPosition: number = 0;
    const leftPosition: number = 1;
    const rightPosition: number = 2;
    const bottomPosition: number = 3;

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSPosition />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((BaseCSSPosition as any).name).toBe(BaseCSSPosition.displayName);
    });
    test("should show the position input elements if the position prop is set to `absolute`", () => {
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.absolute }} />
        );

        expect(rendered.find("input").length).toBe(4);
    });
    test("should show the position input elements if the position prop is set to `fixed`", () => {
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.fixed }} />
        );

        expect(rendered.find("input").length).toBe(4);
    });
    test("should show the position input elements if the position prop is set to `relative`", () => {
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.relative }} />
        );

        expect(rendered.find("input").length).toBe(4);
    });
    test("should not show the position input elements if the position is set to `static`", () => {
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.static }} />
        );

        expect(rendered.find("input").length).toBe(0);
    });
    test("should pass the `position` prop values to the select element", () => {
        const renderedAbsolute: any = mount(
            <CSSPosition data={{ position: PositionValue.absolute }} />
        );
        const renderedFixed: any = mount(
            <CSSPosition data={{ position: PositionValue.fixed }} />
        );
        const renderedRelative: any = mount(
            <CSSPosition data={{ position: PositionValue.relative }} />
        );
        const renderedStatic: any = mount(
            <CSSPosition data={{ position: PositionValue.static }} />
        );

        expect(renderedAbsolute.find("select").prop("value")).toBe(
            PositionValue.absolute
        );
        expect(renderedFixed.find("select").prop("value")).toBe(PositionValue.fixed);
        expect(renderedRelative.find("select").prop("value")).toBe(
            PositionValue.relative
        );
        expect(renderedStatic.find("select").prop("value")).toBe(PositionValue.static);
    });
    test("should pass the `top` prop values to the top input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.absolute, top: value }} />
        );
        const input: any = rendered.find("input").at(topPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should pass the `left` prop values to the left input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.absolute, left: value }} />
        );
        const input: any = rendered.find("input").at(leftPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should pass the `right` prop values to the right input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.absolute, right: value }} />
        );
        const input: any = rendered.find("input").at(rightPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should pass the `bottom` prop values to the bottom input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition data={{ position: PositionValue.absolute, bottom: value }} />
        );
        const input: any = rendered.find("input").at(bottomPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should fire `onUpdate` callback if the `position` prop is changed", () => {
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.position).toBe(PositionValue.static);
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute }}
                onUpdate={callback}
            />
        );
        rendered.find("select").simulate("change", {
            target: {
                value: PositionValue.static,
            },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onUpdate` callback if the `top` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.top).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(topPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onUpdate` callback if the `left` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.left).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(leftPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onUpdate` callback if the `right` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.right).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(rightPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onUpdate` callback if the `bottom` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.bottom).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(bottomPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `left` prop value to be added to the `onUpdate` callback if the `right` prop is being set", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.right).toBe(value);
                expect(args.left).toBe(undefined);
                expect(args.position).toBe("absolute");
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute, left: value }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(rightPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `right` prop value to be added to the `onUpdate` callback if the `left` prop is being set", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.left).toBe(value);
                expect(args.right).toBe(undefined);
                expect(args.position).toBe("absolute");
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute, right: value }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(leftPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `bottom` prop value to be added to the `onUpdate` callback if the `top` prop is being set", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.top).toBe(value);
                expect(args.bottom).toBe(undefined);
                expect(args.position).toBe("absolute");
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute, bottom: value }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(topPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `top` prop value to be added to the `onUpdate` callback if the `bottom` prop is being set", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.bottom).toBe(value);
                expect(args.top).toBe(undefined);
                expect(args.position).toBe("absolute");
            }
        );
        const rendered: any = mount(
            <CSSPosition
                data={{ position: PositionValue.absolute, top: value }}
                onUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(bottomPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
});
