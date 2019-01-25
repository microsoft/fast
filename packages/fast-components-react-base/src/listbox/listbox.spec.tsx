import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Listbox, { ListboxUnhandledProps } from "./listbox";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("listbox", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Listbox as any).name).toBe(Listbox.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Listbox />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ListboxUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<Listbox {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should not have a focusIndex if no children are focusable", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div>hello world</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(-1);
    });

    test("should set focusIndex to the first focusable element on mount", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div>not a focusable element</div>
                <div role="option">focusable element</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should move focus down when the down arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div role="option">one</div>
                <div role="option">two</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should move focus down when the right arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div role="option">one</div>
                <div role="option">two</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowRight });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should move focus up when the up arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div role="option">one</div>
                <div role="option">two</div>
            </Listbox>
        );

        rendered.setState({ focusIndex: 1 });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("focusIndex")).toBe(0);
    });

    test("should move focus up when the left arrow is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div role="option">one</div>
                <div role="option">two</div>
            </Listbox>
        );

        rendered.setState({ focusIndex: 1 });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowUp });
        expect(rendered.state("focusIndex")).toBe(0);
    });

    test("should move focus the last focusable element when the end key is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div role="option">one</div>
                <div role="option">two</div>
                <div role="option">three</div>
                <div>four</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.end });
        expect(rendered.state("focusIndex")).toBe(2);
    });

    test("should move focus the first focusable element when the home key is pressed", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div>one</div>
                <div role="option">two</div>
                <div role="option">three</div>
                <div role="option">four</div>
            </Listbox>
        );

        rendered.setState({ focusIndex: 3 });
        expect(rendered.state("focusIndex")).toBe(3);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.home });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("should not place focus any child without a the proper role", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div />
                <div role="option">two</div>
                <div />
                <div role="option">three</div>
                <div />
                <div role="option">four</div>
                <div />
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(3);

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.state("focusIndex")).toBe(5);
    });

    test("should move focus to matching items as characters are typed", (): void => {
        const rendered: any = mount(
            <Listbox typeAheadPropertyKey="title">
                <div role="option" title="a">
                    a
                </div>
                <div role="option" title="ab">
                    ab
                </div>
                <div role="option" title="abc">
                    abc
                </div>
                <div>four</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "a" });
        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "b" });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { key: "c" });
        expect(rendered.state("focusIndex")).toBe(2);

        rendered.childAt(0).simulate("keydown", { key: "d" });
        expect(rendered.state("focusIndex")).toBe(2);
    });

    test("should not move focus if characters are typed that don't have matches", (): void => {
        const rendered: any = mount(
            <Listbox typeAheadPropertyKey="title">
                <div role="option" title="a">
                    a
                </div>
                <div role="option" title="b">
                    ab
                </div>
                <div role="option" title="c">
                    abc
                </div>
                <div>four</div>
            </Listbox>
        );

        expect(rendered.state("focusIndex")).toBe(0);

        rendered.childAt(0).simulate("keydown", { key: "b" });
        expect(rendered.state("focusIndex")).toBe(1);

        rendered.childAt(0).simulate("keydown", { key: "x" });
        expect(rendered.state("focusIndex")).toBe(1);
    });

    test("aria-activedescendant value should change with focus changes", (): void => {
        const rendered: any = mount(
            <Listbox>
                <div role="option" id="1">
                    1
                </div>
                <div role="option" id="2">
                    2
                </div>
            </Listbox>
        );

        expect(rendered.childAt(0).prop("aria-activedescendant")).toBe("");

        rendered.childAt(0).simulate("keydown", { keyCode: KeyCodes.arrowDown });
        expect(rendered.childAt(0).prop("aria-activedescendant")).toBe("2");
    });

    test("aria-multiselectable value should be true when in multi-select mode", (): void => {
        const rendered: any = mount(<Listbox multiselectible={true} />);

        expect(rendered.childAt(0).prop("aria-multiselectable")).toBe(true);
    });
});
