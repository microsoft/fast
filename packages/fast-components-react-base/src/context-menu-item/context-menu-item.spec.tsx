import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import ContextMenuItem, {
    ContextMenuItemHandledProps,
    ContextMenuItemProps,
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

    test("should not call a registered callback after a click event because it is disabled", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(
            <ContextMenuItem onInvoke={onInvoke} disabled={true} />
        );

        rendered.simulate("click");

        expect(onInvoke).toHaveBeenCalledTimes(0);
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

    test("should not call a registered callback after enter key is pressed because it is disabled", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(
            <ContextMenuItem onInvoke={onInvoke} disabled={true} />
        );

        rendered.simulate("keydown", { keyCode: KeyCodes.enter });

        expect(onInvoke).toHaveBeenCalledTimes(0);
    });

    test("should ensure onClick and onKeyDown props are called when triggered", (): void => {
        // These props are used internally, so we should test that handlers provided as props are still called
        const onClick: any = jest.fn();
        const onKeyDown: any = jest.fn();

        const rendered: any = shallow(
            <ContextMenuItem onClick={onClick} onKeyDown={onKeyDown} />
        );

        rendered.simulate("keydown");
        rendered.simulate("click");

        expect(onClick).toBeCalledTimes(1);
        expect(onKeyDown).toBeCalledTimes(1);
    });

    // parametrized contex-menu-item class name tests
    [
        {
            name: "should correctly assign className from input props",
            contextMenuItemHandledProps: {} as ContextMenuItemHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled and root class name is empty",
            contextMenuItemHandledProps: {
                disabled: true,
            } as ContextMenuItemHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className when is disabled",
            contextMenuItemHandledProps: {
                disabled: true,
            } as ContextMenuItemHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name not present) and managed class given",
            contextMenuItemHandledProps: {
                disabled: true,
                managedClasses: {
                    contextMenuItem: "context-menu-item-class",
                },
            } as ContextMenuItemHandledProps,
            className: "",
            expectedClassName: "context-menu-item-class",
        },
        {
            name:
                "should correctly assign className when is disabled (name present) and managed class given",
            contextMenuItemHandledProps: {
                disabled: true,
                managedClasses: {
                    contextMenuItem: "context-menu-item-class",
                    contextMenuItem__disabled: "disabled",
                },
            } as ContextMenuItemHandledProps,
            className: "",
            expectedClassName: "context-menu-item-class disabled",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed and root class name present",
            contextMenuItemHandledProps: {
                disabled: true,
                managedClasses: {
                    contextMenuItem: "context-menu-item-name",
                    contextMenuItem__disabled: "disabled",
                },
            } as ContextMenuItemHandledProps,
            className: "root-name",
            expectedClassName: "context-menu-item-name disabled root-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed, root class name present, role not",
            contextMenuItemHandledProps: {
                disabled: true,
                role: ContextMenuItemRole.menuItemCheckbox,
                managedClasses: {
                    contextMenuItem: "context-menu-item-name",
                    contextMenuItem__disabled: "disabled",
                },
            } as ContextMenuItemHandledProps,
            className: "root-name",
            expectedClassName: "context-menu-item-name disabled root-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed, root class name present, role not",
            contextMenuItemHandledProps: {
                disabled: true,
                role: ContextMenuItemRole.menuItemRadio,
                managedClasses: {
                    contextMenuItem: "context-menu-item-name",
                },
            } as ContextMenuItemHandledProps,
            className: "root-name",
            expectedClassName: "context-menu-item-name root-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed, root, role class name present",
            contextMenuItemHandledProps: {
                disabled: true,
                role: ContextMenuItemRole.menuItemCheckbox,
                managedClasses: {
                    contextMenuItem: "context-menu-item-name",
                    contextMenuItem__disabled: "disabled",
                    contextMenuItem__checkbox: "context-menu-item-checkbox",
                },
            } as ContextMenuItemHandledProps,
            className: "root-name",
            expectedClassName:
                "context-menu-item-name context-menu-item-checkbox disabled root-name",
        },
    ].forEach(
        ({ name, contextMenuItemHandledProps, className, expectedClassName }: any) => {
            test(name, () => {
                const props: ContextMenuItemProps = { ...contextMenuItemHandledProps };

                const rendered: any = shallow(
                    <ContextMenuItem {...props} className={className} />
                );

                expect(rendered.prop("className")).toEqual(expectedClassName);
            });
        }
    );
});
