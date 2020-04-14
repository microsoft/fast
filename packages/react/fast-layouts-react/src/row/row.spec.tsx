import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { Row, RowClassNamesContract, RowHandledProps, RowUnhandledProps } from "./row";
import { RowResizeDirection } from "./row.props";
import { RowResizeControlProps } from ".";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Row", (): void => {
    const managedClasses: RowClassNamesContract = {
        row: "row",
        row__fill: "row__fill",
        row_resizeHandle: "row_resizeHandle",
        row__resizeNorth: "row__resizeNorth",
        row__resizeSouth: "row__resizeSouth",
        row__overlay: "row__overlay",
        row__hidden: "row__hidden",
    };

    test("should have a displayName that matches the component name", () => {
        expect(`${(Row as any).name}`).toBe(Row.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Row />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: RowUnhandledProps = {
            "aria-label": "foo",
        };

        const props: RowHandledProps & RowUnhandledProps = {
            ...unhandledProps,
        };

        const rendered: any = mount(<Row managedClasses={managedClasses} {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("foo");
    });

    test("should set a default initialHeight value if no `initialHeight` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().initialHeight).not.toBe(undefined);
        expect(rendered.props().initialHeight).toBe(40);
    });

    test("should set a initialHeight value equal to the `initialHeight` prop when passed", () => {
        const rendered: any = mount(
            <Row initialHeight={450} managedClasses={managedClasses} />
        );

        expect(rendered.props().initialHeight).toBe(450);
    });

    test("should set a default collapsedHeight value if no `collapsedHeight` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().collapsedHeight).not.toBe(undefined);
        expect(rendered.props().collapsedHeight).toBe(40);
    });

    test("should set a collapsedHeight value equal to the `collapsedHeight` prop when passed", () => {
        const rendered: any = mount(
            <Row collapsedHeight={45} managedClasses={managedClasses} />
        );

        expect(rendered.props().collapsedHeight).toBe(45);
    });

    test("should set a default minHeight value if no `minHeight` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().minHeight).not.toBe(undefined);
        expect(rendered.props().minHeight).toBe(40);
    });

    test("should set a minHeight value equal to the `minHeight` prop when passed", () => {
        const rendered: any = mount(
            <Row minHeight={30} managedClasses={managedClasses} />
        );

        expect(rendered.props().minHeight).toBe(30);
    });

    test("should set a default maxHeight value if no `maxHeight` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().maxHeight).not.toBe(undefined);
        expect(rendered.props().maxHeight).toBe(800);
    });

    test("should set a maxHeight value equal to the `maxHeight` prop when passed", () => {
        const rendered: any = mount(
            <Row maxHeight={300} managedClasses={managedClasses} />
        );

        expect(rendered.props().maxHeight).toBe(300);
    });

    test("should default `resizable` to false if no `resizable` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().resizable).toBe(false);
    });

    test("should set `resizable` to value of `resizable` prop when passed", () => {
        const rendered: any = mount(
            <Row resizable={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().resizable).toBe(true);
    });

    test("should default `collapsed` to false if no `collapsed` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().collapsed).toBe(false);
    });

    test("should set `collapsed` to value of `collapsed` prop when passed", () => {
        const rendered: any = mount(
            <Row collapsed={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().collapsed).toBe(true);
    });

    test("should default `overlay` to false if no `overlay` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().overlay).toBe(false);
    });

    test("should set `overlay` to value of `overlay` prop when passed", () => {
        const rendered: any = mount(
            <Row overlay={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().overlay).toBe(true);
    });

    test("should default `hidden` to false if no `hidden` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().hidden).toBe(false);
    });

    test("should set `hidden` to value of `hidden` prop when passed", () => {
        const rendered: any = mount(
            <Row hidden={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().hidden).toBe(true);
    });

    test("should default `fill` to false if no `fill` prop is passed", () => {
        const rendered: any = mount(<Row managedClasses={managedClasses} />);

        expect(rendered.props().fill).toBe(false);
    });

    test("should set `fill` to value of `fill` prop when passed", () => {
        const rendered: any = mount(<Row fill={true} managedClasses={managedClasses} />);

        expect(rendered.props().fill).toBe(true);
    });

    describe("resize", () => {
        test("should render a `resize control` when `resizable` prop is true", () => {
            const rendered: any = mount(
                <Row resizable={true} managedClasses={managedClasses} />
            );

            expect(rendered.find(`.${managedClasses.row_resizeHandle}`)).toHaveLength(1);
        });

        test("should NOT render a `resize control` when `resizable` prop is false", () => {
            const rendered: any = mount(<Row managedClasses={managedClasses} />);

            expect(rendered.find(`.${managedClasses.row_resizeHandle}`)).toHaveLength(0);
        });

        test("should NOT render a `resize control` when `resizable` prop is true and `collapsed` is true", () => {
            const rendered: any = mount(<Row managedClasses={managedClasses} />);

            expect(rendered.find(`.${managedClasses.row_resizeHandle}`)).toHaveLength(0);
        });

        test("should render a custom `resize` control when passed via the `resizeControl` prop", () => {
            const customControl: (props: RowResizeControlProps) => React.ReactNode = (
                props: RowResizeControlProps
            ): React.ReactNode => <button id={"foo"} {...props} />;
            const rendered: any = mount(
                <Row
                    managedClasses={managedClasses}
                    resizable={true}
                    resizeControl={customControl}
                />
            );

            expect(rendered.find("#foo")).toHaveLength(1);
        });

        test("should NOT render a custom `resize` control when `resizeControl` prop is passed and `resizable` is false", () => {
            const customControl: (props: RowResizeControlProps) => React.ReactNode = (
                props: RowResizeControlProps
            ): React.ReactNode => <button id={"foo"} {...props} />;
            const rendered: any = mount(
                <Row
                    managedClasses={managedClasses}
                    resizable={false}
                    resizeControl={customControl}
                />
            );

            expect(rendered.find("#foo")).toHaveLength(0);
        });

        test("should have role of separator", () => {
            const rendered: any = mount(
                <Row resizable={true} managedClasses={managedClasses} />
            );

            expect(
                rendered.find(`.${managedClasses.row_resizeHandle}`).props().role
            ).toBe("separator");
        });

        test("should fire an onResize callback on keydown of the `resize control` when `onResize` prop is passed", (): void => {
            const mockResize: any = jest.fn();
            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowUp });

            expect(mockResize).toHaveBeenCalledTimes(1);
        });

        test("should increment `height` in state when a user presses up arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.north`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizable={true}
                    resizeFrom={RowResizeDirection.north}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowUp });

            expect(rendered.state().height).toBe(initialHeight + 1);
        });

        test("should decrement `height` in state when a user presses down arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.north`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizeFrom={RowResizeDirection.north}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowDown });

            expect(rendered.state().height).toBe(initialHeight - 1);
        });

        test("should decrement `height` in state when a user presses up arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.south`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizable={true}
                    resizeFrom={RowResizeDirection.south}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowUp });

            expect(rendered.state().height).toBe(initialHeight - 1);
        });

        test("should increment `height` in state when a user presses down arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.south`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizeFrom={RowResizeDirection.south}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowDown });

            expect(rendered.state().height).toBe(initialHeight + 1);
        });

        xtest("should increment `height` in state by 10 when a user presses shift and up arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.north`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizable={true}
                    resizeFrom={RowResizeDirection.north}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { isShift: true, keyCode: KeyCodes.arrowUp });

            expect(rendered.state().height).toBe(initialHeight + 10);
        });

        xtest("should decrement `height` in state by 10 when a user presses shift and down arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.north`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizeFrom={RowResizeDirection.north}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { isShift: true, keyCode: KeyCodes.arrowDown });

            expect(rendered.state().height).toBe(initialHeight - 10);
        });

        xtest("should decrement `height` in state by 10 when a user presses shift and up arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.south`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizable={true}
                    resizeFrom={RowResizeDirection.south}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { isShift: true, keyCode: KeyCodes.arrowUp });

            expect(rendered.state().height).toBe(initialHeight - 10);
        });

        xtest("should increment `height` in state by 10 when a user presses shift and down arrow on `resize control` and `resizeFrom` prop is `RowResizeDirection.south`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizeFrom={RowResizeDirection.south}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { isShift: true, keyCode: KeyCodes.arrowDown });

            expect(rendered.state().height).toBe(initialHeight + 10);
        });

        xtest("should NOT update `height` in state when a user presses a key other than up or down on `resize control`", () => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizeFrom={RowResizeDirection.south}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialHeight: number = rendered.state().height;

            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowRight });

            expect(rendered.state().height).toBe(initialHeight);
        });

        test("should add mousemove event listener to the document when `onResize` prop is passed, `resize` state is true, and previously was not resizing", () => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            document.addEventListener = jest.fn((event: string, callback: any) => {
                map[event] = callback;
            });

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // set state to resizing
            rendered.setState({ resizing: true });

            expect(map.mousemove).not.toBe(undefined);
            expect(typeof map.mousemove === "function").toBe(true);
        });

        test("should add mouseup event listener to the document when `onResize` prop is passed, `resize` state is true, and previously was not resizing", () => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            document.addEventListener = jest.fn((event: string, callback: any) => {
                map[event] = callback;
            });

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // set state to resizing
            rendered.setState({ resizing: true });

            expect(map.mouseup).not.toBe(undefined);
            expect(typeof map.mouseup === "function").toBe(true);
        });

        test("should fire an onResize callback on document mousemove event when `onResize` prop is passed", (): void => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            document.addEventListener = jest.fn((event: string, callback: any) => {
                map[event] = callback;
            });

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // set state to resizing
            rendered.setState({ resizing: true });

            // mock mousemove event
            map.mousemove({});

            expect(mockResize).toHaveBeenCalledTimes(1);
        });

        test("should start resizing on mousedown events of resize handle with left mouse click", (): void => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // mock mouseup event
            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("mousedown", { button: 0 });

            expect(rendered.state("resizing")).toBe(true);
        });

        test("should NOT start resizing on document mousedown when event is NOT from left mouse click", (): void => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // mock mouseup event
            rendered
                .find(`.${managedClasses.row_resizeHandle}`)
                .simulate("mousedown", { button: 1 });

            expect(rendered.state("resizing")).toBe(false);
        });

        test("should stop resizing on document mouseup events with left mouse click", (): void => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            document.addEventListener = jest.fn((event: string, callback: any) => {
                map[event] = callback;
            });

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // set state to resizing
            rendered.setState({ resizing: true });

            // mock mouseup event
            map.mouseup({ button: 0 });

            expect(rendered.state("resizing")).toBe(false);
        });

        test("should NOT stop resizing on document mouseup events when event is NOT from left mouse click", (): void => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            document.addEventListener = jest.fn((event: string, callback: any) => {
                map[event] = callback;
            });

            const rendered: any = mount(
                <Row
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // set state to resizing
            rendered.setState({ resizing: true });

            // mock mouseup event
            map.mouseup({ button: 1 });

            expect(rendered.state("resizing")).toBe(true);
        });
    });
});
