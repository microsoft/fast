import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import Toolbar, { ToolbarUnhandledProps } from "./toolbar";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { DisplayNamePrefix } from "../utilities";
import { Orientation } from "@microsoft/fast-web-utilities";
import ToolbarItemGroup from "../toolbar-item-group";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

// mock the isFocusable functionb because Tabbable doesn't like our test environment
Toolbar.isFocusable = jest.fn(
    (element: HTMLElement): boolean => {
        return element instanceof HTMLButtonElement;
    }
);

/* tslint:disable:no-string-literal */
describe("toolbar", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(Toolbar as any).name}`).toBe(Toolbar.displayName);
    });

    test("should have correct role attribute 'toolbar'", () => {
        const rendered: ShallowWrapper = shallow(<Toolbar />);
        const toolbar: any = rendered.find('[role="toolbar"]');
        expect(toolbar.prop("role")).toBe("toolbar");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Toolbar />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ToolbarUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<Toolbar {...unhandledProps} />);
        const toolbar: any = rendered.find('[role="toolbar"]');
        expect(toolbar.prop("aria-label")).toEqual("label");
    });

    test("should have a focusItemPath of '-1' if no children are focusable", (): void => {
        const rendered: any = mount(
            <Toolbar>
                <div>hello world</div>
            </Toolbar>
        );

        expect(rendered.state("focusItemPath")).toBe("-1");
    });

    test("should have a valid focusItemPath if there are focusable children", (): void => {
        const rendered: any = mount(
            <Toolbar style={{ position: "absolute", height: "100px", width: "100px" }}>
                <button />
            </Toolbar>
        );

        expect(rendered.state("focusItemPath")).toBe("0");
    });

    test("should set focusItemPath to the first focusable element on mount", (): void => {
        const rendered: any = mount(
            <Toolbar>
                <div>not a focusable element</div>
                <button>focusable element</button>
            </Toolbar>
        );

        expect(rendered.state("focusItemPath")).toBe("1");
    });

    test("initial focus index prop is applied", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.horizontal} initialFocusIndex={1}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("1");

        document.body.removeChild(container);
    });

    test("should move focus right when the right arrow is pressed in horizontal mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.horizontal}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("0");
        rendered
            .instance()
            ["handleKeyDown"]({ keyCode: keyCodeArrowRight, preventDefault: jest.fn() });
        expect(rendered.state("focusItemPath")).toBe("1");

        document.body.removeChild(container);
    });

    test("should not move focus right when the right arrow is pressed in vertical mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.vertical}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        rendered.childAt(0).simulate("keydown", { keyCode: keyCodeArrowRight });

        expect(rendered.state("focusItemPath")).toBe("0");

        document.body.removeChild(container);
    });

    test("should move focus down when the down arrow is pressed in vertical mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.vertical}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("0");
        rendered
            .instance()
            ["handleKeyDown"]({ keyCode: keyCodeArrowDown, preventDefault: jest.fn() });
        expect(rendered.state("focusItemPath")).toBe("1");

        document.body.removeChild(container);
    });

    test("should not move focus down when the down arrow is pressed in horizontal mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.horizontal}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("0");
        rendered
            .find("button")
            .first()
            .simulate("keydown", { keyCode: keyCodeArrowRight });
        expect(rendered.state("focusItemPath")).toBe("1");

        document.body.removeChild(container);
    });

    test("should move focus up when the up arrow is pressed in vertical mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.vertical} initialFocusIndex={1}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("1");
        rendered
            .find("button")
            .first()
            .simulate("keydown", { keyCode: keyCodeArrowUp });
        expect(rendered.state("focusItemPath")).toBe("0");

        document.body.removeChild(container);
    });

    test("should not move focus up when the up arrow is pressed in horizontal mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.horizontal} initialFocusIndex={1}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("1");
        rendered
            .find("button")
            .first()
            .simulate("keydown", { keyCode: keyCodeArrowUp });
        expect(rendered.state("focusItemPath")).toBe("1");

        document.body.removeChild(container);
    });

    test("should move focus left when the left arrow is pressed in horizontal mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.horizontal} initialFocusIndex={1}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("1");
        rendered
            .find("button")
            .first()
            .simulate("keydown", { keyCode: keyCodeArrowLeft });
        expect(rendered.state("focusItemPath")).toBe("0");

        document.body.removeChild(container);
    });

    test("should not move focus left when the right arrow is pressed in vertical mode", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <Toolbar orientation={Orientation.vertical} initialFocusIndex={1}>
                <button>one</button>
                <button>two</button>
            </Toolbar>,
            { attachTo: container }
        );

        expect(rendered.state("focusItemPath")).toBe("1");
        rendered
            .find("button")
            .first()
            .simulate("keydown", { keyCode: keyCodeArrowLeft });
        expect(rendered.state("focusItemPath")).toBe("1");

        document.body.removeChild(container);
    });
});
