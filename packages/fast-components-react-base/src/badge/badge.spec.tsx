import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Badge, { BadgeHandledProps, BadgeProps, BadgeUnhandledProps } from "./index";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("badge", (): void => {
    test("should have a displayName that includes the component name", () => {
        expect(`${DisplayNamePrefix}${(Badge as any).name}`).toBe(Badge.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Badge />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: BadgeHandledProps = {
            children: "foo",
        };

        const unhandledProps: BadgeUnhandledProps = {
            "aria-hidden": true,
        };

        const props: BadgeProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<Badge {...props} />);

        expect(rendered.find("span").prop("aria-hidden")).toEqual(true);
    });
});
