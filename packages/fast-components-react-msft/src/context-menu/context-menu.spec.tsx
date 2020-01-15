import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import MSFTContextMenu from "./context-menu";
import { ContextMenuUnhandledProps } from "./index";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("context menu", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTContextMenu as any).name}`).toBe(
            MSFTContextMenu.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTContextMenu />);
        }).not.toThrow();
    });
});
