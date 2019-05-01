import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ViewportPositioner, {
    ViewportPositionerHandledProps,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
} from "./viewport-positioner";
import { DisplayNamePrefix } from "../utilities";
import { Direction } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("viewport positioner", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(ViewportPositioner as any).name}`).toBe(
            ViewportPositioner.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ViewportPositioner />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ViewportPositionerUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ViewportPositioner {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });
});
