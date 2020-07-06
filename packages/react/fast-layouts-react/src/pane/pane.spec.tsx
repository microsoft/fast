import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import {
    Pane,
    PaneClassNamesContract,
    PaneHandledProps,
    PaneUnhandledProps,
} from "./pane";
import { PaneResizeDirection } from "./pane.props";
import { PaneResizeControlProps } from ".";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Pane", (): void => {
    const managedClasses: PaneClassNamesContract = {
        pane: "pane",
        pane__hidden: "pane__hidden",
        pane__overlay: "pane__overlay",
        pane__resizeEast: "pane__resizeEast",
        pane__resizeWest: "pane__resizeWest",
        pane_resizeHandle: "pane__resizeHandle",
    };
    test("should have a displayName that matches the component name", () => {
        expect(`${(Pane as any).name}`).toBe(Pane.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Pane />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: PaneUnhandledProps = {
            "aria-label": "foo",
        };

        const props: PaneHandledProps & PaneUnhandledProps = {
            ...unhandledProps,
        };

        const rendered: any = mount(<Pane managedClasses={managedClasses} {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("foo");
    });

    test("should set a default initialWidth value if no `initialWidth` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().initialWidth).not.toBe(undefined);
        expect(rendered.props().initialWidth).toBe(300);
    });

    test("should set a initialWidth value if equal to the `initialWidth` prop when passed", () => {
        const rendered: any = mount(
            <Pane initialWidth={450} managedClasses={managedClasses} />
        );

        expect(rendered.props().initialWidth).toBe(450);
    });

    test("should set a default collapsedWidth value if no `collapsedWidth` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().collapsedWidth).not.toBe(undefined);
        expect(rendered.props().collapsedWidth).toBe(40);
    });

    test("should set a collapsedWidth value if equal to the `collapsedWidth` prop when passed", () => {
        const rendered: any = mount(
            <Pane collapsedWidth={45} managedClasses={managedClasses} />
        );

        expect(rendered.props().collapsedWidth).toBe(45);
    });

    test("should set a default minWidth value if no `minWidth` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().minWidth).not.toBe(undefined);
        expect(rendered.props().minWidth).toBe(100);
    });

    test("should set a minWidth value if equal to the `minWidth` prop when passed", () => {
        const rendered: any = mount(
            <Pane minWidth={30} managedClasses={managedClasses} />
        );

        expect(rendered.props().minWidth).toBe(30);
    });

    test("should set a default maxWidth value if no `maxWidth` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().maxWidth).not.toBe(undefined);
        expect(rendered.props().maxWidth).toBe(800);
    });

    test("should set a maxWidth value if equal to the `maxWidth` prop when passed", () => {
        const rendered: any = mount(
            <Pane maxWidth={300} managedClasses={managedClasses} />
        );

        expect(rendered.props().maxWidth).toBe(300);
    });

    test("should default `resizable` to false if no `resizable` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().resizable).toBe(false);
    });

    test("should set `resizable` to value of `resizable` prop when passed", () => {
        const rendered: any = mount(
            <Pane resizable={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().resizable).toBe(true);
    });

    test("should default `collapsed` to false if no `collapsed` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().collapsed).toBe(false);
    });

    test("should set a `minWidth` inline style value equal to `collapsedWidth` if `collapsed` prop is passed", () => {
        const rendered: any = shallow(
            <Pane collapsed={true} collapsedWidth={300} managedClasses={managedClasses} />
        );

        expect(rendered.props().style.minWidth).toBe("300px");
    });

    test("should set a `minWidth` inline style value equal to `minWidth` prop if `collapsed` prop is false and `resizeable` prop is true", () => {
        const rendered: any = shallow(
            <Pane
                collapsed={false}
                minWidth={500}
                collapsedWidth={300}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.minWidth).toBe("500px");
    });

    test("should set a `minWidth` inline style value equal to `minWidth` prop if `collapsed` and `resizeable` props are false and the `width` prop or state is smaller than `midWidth`", () => {
        const rendered: any = shallow(
            <Pane
                collapsed={false}
                minWidth={500}
                maxWidth={800}
                managedClasses={managedClasses}
            />
        );

        rendered.setProps({ width: 300 });

        expect(rendered.props().style.minWidth).toBe("500px");

        rendered.setState({ width: 301 });

        expect(rendered.props().style.minWidth).toBe("500px");
    });

    test("should set a `minWidth` inline style value equal to `maxWidth` prop if `collapsed` and `resizeable` props are false and the `width` prop or state is larger than `maxWidth`", () => {
        const rendered: any = shallow(
            <Pane
                collapsed={false}
                minWidth={500}
                maxWidth={800}
                managedClasses={managedClasses}
            />
        );

        rendered.setProps({ width: 900 });

        expect(rendered.props().style.minWidth).toBe("800px");

        rendered.setState({ width: 801 });

        expect(rendered.props().style.minWidth).toBe("800px");
    });

    test("should set `collapsed` to value of `collapsed` prop when passed", () => {
        const rendered: any = mount(
            <Pane collapsed={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().collapsed).toBe(true);
    });

    test("should default `overlay` to false if no `overlay` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().overlay).toBe(false);
    });

    test("should set `overlay` to value of `overlay` prop when passed", () => {
        const rendered: any = mount(
            <Pane overlay={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().overlay).toBe(true);
    });

    test("should add a `pane__overlay`className when the `overlay` prop is passed", () => {
        const rendered: any = shallow(
            <Pane overlay={true} managedClasses={managedClasses} />
        );

        expect(rendered.prop("className")).toContain("pane__overlay");
    });

    test("should set a inline style value for width when the `overlay` prop is passed", () => {
        const rendered: any = shallow(
            <Pane
                overlay={true}
                minWidth={1}
                initialWidth={1}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.width).toStrictEqual(`${rendered.state().width}px`);
    });

    test("should set a inline style value for flexBasis equal to the width when the `overlay` prop is FALSE", () => {
        const rendered: any = shallow(
            <Pane
                overlay={false}
                minWidth={1}
                initialWidth={1}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.flexBasis).toStrictEqual(
            `${rendered.state().width}px`
        );
    });

    test("should default `hidden` to false if no `hidden` prop is passed", () => {
        const rendered: any = mount(<Pane managedClasses={managedClasses} />);

        expect(rendered.props().hidden).toBe(false);
    });

    test("should set `hidden` to value of `hidden` prop when passed", () => {
        const rendered: any = mount(
            <Pane hidden={true} managedClasses={managedClasses} />
        );

        expect(rendered.props().hidden).toBe(true);
    });

    test("should set `aria-hidden` to value of `hidden` prop when passed", () => {
        const rendered: any = shallow(
            <Pane hidden={true} managedClasses={managedClasses} />
        );

        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should apply a `pane__hidden` className when `hidden` is prop is true", () => {
        const rendered: any = shallow(
            <Pane hidden={true} managedClasses={managedClasses} />
        );

        expect(rendered.prop("className")).toContain(managedClasses.pane__hidden);
    });

    test("should apply a `pane__resizeEast` className when `resizeFrom` is set to PaneResizeDirection is `east`", () => {
        const rendered: any = shallow(
            <Pane resizeFrom={PaneResizeDirection.east} managedClasses={managedClasses} />
        );

        expect(rendered.prop("className")).toContain(managedClasses.pane__resizeEast);
    });

    test("should apply a `pane__resizeWest` className when `resizeFrom` is set to PaneResizeDirection is `west`", () => {
        const rendered: any = shallow(
            <Pane resizeFrom={PaneResizeDirection.west} managedClasses={managedClasses} />
        );

        expect(rendered.prop("className")).toContain(managedClasses.pane__resizeWest);
    });

    describe("resize", () => {
        test("should render a `resize control` by default when `resizable` prop is true", () => {
            const rendered: any = mount(
                <Pane resizable={true} managedClasses={managedClasses} />
            );

            expect(rendered.find(`.${managedClasses.pane_resizeHandle}`)).toHaveLength(1);
        });

        test("should NOT render a `resize control` when `resizable` prop is false", () => {
            const rendered: any = mount(<Pane managedClasses={managedClasses} />);

            expect(rendered.find(`.${managedClasses.pane_resizeHandle}`)).toHaveLength(0);
        });

        test("should render a custom `resize` control when passed via the `resizeControl` prop", () => {
            const customControl: (props: PaneResizeControlProps) => React.ReactNode = (
                props: PaneResizeControlProps
            ): React.ReactNode => <button id={"foo"} />;
            const rendered: any = mount(
                <Pane
                    managedClasses={managedClasses}
                    resizable={true}
                    resizeControl={customControl}
                />
            );

            expect(rendered.find("#foo")).toHaveLength(1);
        });

        test("should NOT render a custom `resize` control when `resizeControl` prop is passed and `resizable` is false", () => {
            const customControl: (props: PaneResizeControlProps) => React.ReactNode = (
                props: PaneResizeControlProps
            ): React.ReactNode => <button id={"foo"} {...props} />;
            const rendered: any = mount(
                <Pane
                    managedClasses={managedClasses}
                    resizable={false}
                    resizeControl={customControl}
                />
            );

            expect(rendered.find("#foo")).toHaveLength(0);
        });

        test("should NOT render a `resize control` when `resizable` prop is true and `collapsed` is true", () => {
            const rendered: any = mount(<Pane managedClasses={managedClasses} />);

            expect(rendered.find(`.${managedClasses.pane_resizeHandle}`)).toHaveLength(0);
        });

        test("should have role of separator", () => {
            const rendered: any = mount(
                <Pane resizable={true} managedClasses={managedClasses} />
            );

            expect(
                rendered.find(`.${managedClasses.pane_resizeHandle}`).props().role
            ).toBe("separator");
        });

        test("separator should have aria-value attributes populated", () => {
            const rendered: any = mount(
                <Pane resizable={true} managedClasses={managedClasses} />
            );

            const separator: any = rendered.find(`.${managedClasses.pane_resizeHandle}`);
            expect(separator.prop("aria-valuemin")).toBe(100);
            expect(separator.prop("aria-valuemax")).toBe(800);
            expect(separator.prop("aria-valuenow")).toBe(300);
        });

        test("should fire an onResize callback on keydown of the `resize control` when `onResize` prop is passed", (): void => {
            const mockResize: any = jest.fn();
            const rendered: any = mount(
                <Pane
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowRight });

            expect(mockResize).toHaveBeenCalledTimes(1);
        });

        test("should increment `width` in state when a user presses right arrow on `resize control`", () => {
            const mockResize: any = jest.fn();

            // Due to client rect call, let's reset width to 0
            const rendered: any = mount(
                <Pane
                    initialWidth={0}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialWidth: number = rendered.state().width;

            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowRight });

            expect(rendered.state().width).toBe(initialWidth + 1);

            rendered.update();
        });

        test("should decrement `width` in state when a user presses left arrow on `resize control`", () => {
            const mockResize: any = jest.fn();

            // Due to client rect call, let's reset width to 0
            const rendered: any = mount(
                <Pane
                    initialWidth={0}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialWidth: number = rendered.state().width;

            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowLeft });

            expect(rendered.state().width).toBe(initialWidth - 1);
        });

        test("should increment `width` in state by 10 when a user presses right arrow and shift on `resize control`", () => {
            const mockResize: any = jest.fn();

            // Due to client rect call, let's reset width to 0
            const rendered: any = mount(
                <Pane
                    initialWidth={0}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialWidth: number = rendered.state().width;

            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("keyDown", { shiftKey: true, keyCode: KeyCodes.arrowRight });

            expect(rendered.state().width).toBe(initialWidth + 10);
        });

        test("should decrement `width` in state by 10 when a user presses left arrow and shift on `resize control`", () => {
            const mockResize: any = jest.fn();

            // Due to client rect call, let's reset width to 0
            const rendered: any = mount(
                <Pane
                    initialWidth={0}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialWidth: number = rendered.state().width;

            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("keyDown", { shiftKey: true, keyCode: KeyCodes.arrowLeft });

            expect(rendered.state().width).toBe(initialWidth - 10);
        });

        test("should NOT update `width` in state when a user presses a key other than right or left arrow on `resize control`", () => {
            const mockResize: any = jest.fn();

            // Due to client rect call, let's reset width to 0
            const rendered: any = mount(
                <Pane
                    initialWidth={0}
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );
            const initialWidth: number = rendered.state().width;

            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("keyDown", { keyCode: KeyCodes.arrowUp });

            expect(rendered.state().width).not.toBe(initialWidth + 1);
            expect(rendered.state().width).not.toBe(initialWidth - 1);
        });

        test("should add window event listener when component mounts", () => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            window.addEventListener = jest.fn((event: string, callback: any) => {
                // if an event is added for resize, add a callback to mock
                if (event === "resize") {
                    callback = mockResize;
                }

                map[event] = callback;
            });
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const rendered: any = mount(
                <Pane
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            map.resize();

            expect(mockResize).toHaveBeenCalledTimes(1);
        });

        test("should remove resize event listener from the window when component unmounts", (): void => {
            const map: any = {};
            const mockResize: any = jest.fn();

            // Mock window.removeEventListener
            window.removeEventListener = jest.fn((event: string, callback: any) => {
                // if an event is added for resize, add a callback to mock
                if (event === "resize") {
                    callback = mockResize;
                }

                map[event] = callback;
            });

            const rendered: any = mount(
                <Pane
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            rendered.unmount();

            map.resize();

            expect(mockResize).toHaveBeenCalledTimes(1);
        });

        test("should add mousemove event listener to the document when `onResize` prop is passed, `resize` state is true, and previously was not resizing", () => {
            const mockResize: any = jest.fn();
            const map: any = {};

            // Mock document.addEventListener
            document.addEventListener = jest.fn((event: string, callback: any) => {
                map[event] = callback;
            });

            const rendered: any = mount(
                <Pane
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
                <Pane
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
                <Pane
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
                <Pane
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // mock mouseup event
            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
                .simulate("mousedown", { button: 0 });

            expect(rendered.state("resizing")).toBe(true);
        });

        test("should NOT start resizing on document mousedown when event is NOT from left mouse click", (): void => {
            const mockResize: any = jest.fn();

            const rendered: any = mount(
                <Pane
                    resizable={true}
                    onResize={mockResize}
                    managedClasses={managedClasses}
                />
            );

            // mock mouseup event
            rendered
                .find(`.${managedClasses.pane_resizeHandle}`)
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
                <Pane
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
                <Pane
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
