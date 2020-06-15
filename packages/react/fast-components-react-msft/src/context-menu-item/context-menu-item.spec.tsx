import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import MSFTContextMenuItem from "./context-menu-item";
import { ContextMenuItem, ContextMenuItemUnhandledProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("context menu item", (): void => {
    const afterExample: JSX.Element = <div className={"after"}>after</div>;
    const beforeExample: JSX.Element = <div className={"before"}>before</div>;

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTContextMenuItem as any).name}`).toBe(
            MSFTContextMenuItem.displayName
        );
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

    test("should render an element from the after prop", (): void => {
        const rendered: any = mount(<ContextMenuItem after={afterExample} />);

        expect(rendered.find(".after")).toHaveLength(1);
    });

    test("should render an element from the before prop", (): void => {
        const rendered: any = mount(<ContextMenuItem before={beforeExample} />);

        expect(rendered.find(".before")).toHaveLength(1);
    });

    test("should render both elements from the after and before props", (): void => {
        const rendered: any = mount(
            <ContextMenuItem after={afterExample} before={beforeExample} />
        );

        expect(rendered.find(".before")).toHaveLength(1);
        expect(rendered.find(".after")).toHaveLength(1);
    });
});
