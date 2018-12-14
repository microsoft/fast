import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import ContextMenuItem, {
    ContextMenuItemRole,
    ContextMenuItemUnhandledProps,
} from "./context-menu-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("context menu item", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((ContextMenuItem as any).name).toBe(ContextMenuItem.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ContextMenuItem />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ContextMenuItemUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ContextMenuItem {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should apply a default role of 'menuitem'", (): void => {
        const rendered: any = shallow(<ContextMenuItem />);

        expect(rendered.first().prop("role")).toEqual("menuitem");
    });

    test("should apply a custom role when provided", (): void => {
        const checkbox: any = shallow(
            <ContextMenuItem role={ContextMenuItemRole.menuItemCheckbox} />
        );
        const radio: any = shallow(
            <ContextMenuItem role={ContextMenuItemRole.menuItemRadio} />
        );

        expect(checkbox.first().prop("role")).toEqual(
            ContextMenuItemRole.menuItemCheckbox
        );
        expect(radio.first().prop("role")).toEqual(ContextMenuItemRole.menuItemRadio);
    });

    test("should apply aria-disabled when disabled", (): void => {
        const rendered: any = shallow(<ContextMenuItem disabled={true} />);

        expect(rendered.first().prop("aria-disabled")).toEqual(true);
    });

    test("should call a registered callback after a click event", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(<ContextMenuItem onInvoke={onInvoke} />);

        rendered.simulate("click");

        expect(onInvoke).toHaveBeenCalledTimes(1);
    });

    test("should call a registered callback after spacebar is pressed", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(<ContextMenuItem onInvoke={onInvoke} />);

        rendered.simulate("keydown", { keyCode: KeyCodes.space });

        expect(onInvoke).toHaveBeenCalledTimes(1);
    });

    test("should call a registered callback after enter key is pressed", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(<ContextMenuItem onInvoke={onInvoke} />);

        rendered.simulate("keydown", { keyCode: KeyCodes.enter });

        expect(onInvoke).toHaveBeenCalledTimes(1);
    });
});
