import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import ToolbarItemGroup, { ToolbarItemGroupUnhandledProps } from "./toolbar-item-group";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("toolbar item group", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(ToolbarItemGroup as any).name}`).toBe(
            ToolbarItemGroup.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ToolbarItemGroup />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ToolbarItemGroupUnhandledProps = {
            "aria-label": "label",
        };
        const rendered: any = shallow(<ToolbarItemGroup {...unhandledProps} />);
        expect(rendered.first().prop("aria-label")).toEqual("label");
    });
});
