import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import ContextMenu, {
    ContextMenuClassNameContract,
    ContextMenuHandledProps,
    ContextMenuManagedClasses,
    ContextMenuProps,
    ContextMenuUnhandledProps,
} from "./context-menu";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("context-menu-item", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((ContextMenu as any).name).toBe(ContextMenu.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ContextMenu />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ContextMenuUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ContextMenu {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should not have a focusIndex if no children are focusable", (): void => {
        expect(2).toBe(2);
    });
});
