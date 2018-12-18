import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import MSFTContextMenuItem from "./context-menu-item";
import {
    ContextMenuItem,
    ContextMenuItemHandledProps,
    ContextMenuItemProps,
    ContextMenuItemUnhandledProps,
} from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("context menu item", (): void => {
    const beforeExample: JSX.Element = <div className={"before"}>before</div>;

    test("should have a displayName that matches the component name", () => {
        expect((MSFTContextMenuItem as any).name).toBe(MSFTContextMenuItem.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTContextMenuItem />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: ContextMenuItemUnhandledProps = {
            "aria-hidden": true,
        };

        const rendered: any = mount(<ContextMenuItem {...unhandledProps} />);

        expect(rendered.find("div").prop("aria-hidden")).toEqual(true);
    });

    test("should render an element from the before prop", (): void => {
        const rendered: any = mount(<ContextMenuItem before={beforeExample} />);

        expect(rendered.find(".before")).toHaveLength(1);
    });
});
