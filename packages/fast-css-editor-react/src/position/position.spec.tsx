import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Position from "./position";
import { CSSPosition } from "./";
import { PositionValue } from "./position.props";

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
        expect((Position as any).name).toBe(Position.displayName);
    });
    test("should show the absolute position input elements if the position prop is set to `absolute`", () => {
        const rendered: any = mount(<CSSPosition position={PositionValue.absolute} />);

        expect(rendered.find("input").length).toBe(4);
    });
    test("should not show the absolute position input elements if the position is not set to `absolute`", () => {
        const rendered: any = mount(<CSSPosition position={PositionValue.static} />);

        expect(rendered.find("input").length).toBe(0);
    });
    test("should pass the `position` prop values to the select element", () => {
        const renderedStatic: any = mount(
            <CSSPosition position={PositionValue.static} />
        );
        const renderedAbsolute: any = mount(
            <CSSPosition position={PositionValue.absolute} />
        );

        expect(renderedStatic.find("select").prop("value")).toBe(PositionValue.static);
        expect(renderedAbsolute.find("select").prop("value")).toBe(
            PositionValue.absolute
        );
    });
    test("should pass the `top` prop values to the top input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} top={value} />
        );
        const input: any = rendered.find("input").at(topPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should pass the `left` prop values to the left input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} left={value} />
        );
        const input: any = rendered.find("input").at(leftPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should pass the `right` prop values to the right input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} right={value} />
        );
        const input: any = rendered.find("input").at(rightPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should pass the `bottom` prop values to the bottom input", () => {
        const value: string = "25px";
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} bottom={value} />
        );
        const input: any = rendered.find("input").at(bottomPosition);

        expect(input.prop("value")).toBe(value);
    });
    test("should fire `onPositionUpdate` callback if the `position` prop is changed", () => {
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.position).toBe(PositionValue.static);
            }
        );
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} onPositionUpdate={callback} />
        );
        rendered.find("select").simulate("change", {
            target: {
                value: PositionValue.static,
            },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onPositionUpdate` callback if the `top` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.top).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} onPositionUpdate={callback} />
        );
        const input: any = rendered.find("input").at(topPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onPositionUpdate` callback if the `left` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.left).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} onPositionUpdate={callback} />
        );
        const input: any = rendered.find("input").at(leftPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onPositionUpdate` callback if the `right` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.right).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} onPositionUpdate={callback} />
        );
        const input: any = rendered.find("input").at(rightPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should fire `onPositionUpdate` callback if the `bottom` prop is changed", () => {
        const value: string = "25px";
        const callback: any = jest.fn(
            (args: any): void => {
                expect(args.bottom).toBe(value);
            }
        );
        const rendered: any = mount(
            <CSSPosition position={PositionValue.absolute} onPositionUpdate={callback} />
        );
        const input: any = rendered.find("input").at(bottomPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `left` prop value to be added to the `onPositionUpdate` callback if the `right` prop is being set", () => {
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
                position={PositionValue.absolute}
                left={value}
                onPositionUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(rightPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `right` prop value to be added to the `onPositionUpdate` callback if the `left` prop is being set", () => {
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
                position={PositionValue.absolute}
                right={value}
                onPositionUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(leftPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `bottom` prop value to be added to the `onPositionUpdate` callback if the `top` prop is being set", () => {
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
                position={PositionValue.absolute}
                bottom={value}
                onPositionUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(topPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
    test("should not allow the `top` prop value to be added to the `onPositionUpdate` callback if the `bottom` prop is being set", () => {
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
                position={PositionValue.absolute}
                top={value}
                onPositionUpdate={callback}
            />
        );
        const input: any = rendered.find("input").at(bottomPosition);
        input.simulate("change", {
            target: { value },
        });

        expect(callback).toHaveBeenCalled();
    });
});
