import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTBadge from "./badge";
import {
    Badge,
    BadgeHandledProps,
    BadgeProps,
    BadgeSize,
    BadgeUnhandledProps,
} from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("badge", (): void => {
    const managedClasses: BadgeClassNameContract = {
        badge: "badge",
        badge__small: "badge__small",
        badge__large: "badge__large",
        badge__filled: "badge__filled",
    };

    test("should have a displayName that matches the component name", () => {
        expect((MSFTBadge as any).name).toBe(MSFTBadge.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTBadge />);
            shallow(<MSFTBadge filled={true} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: BadgeHandledProps = {
            size: BadgeSize.small,
        };

        const unhandledProps: BadgeUnhandledProps = {
            "aria-hidden": true,
        };

        const props: BadgeProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<Badge {...props} />);

        expect(rendered.find("span").prop("aria-hidden")).toEqual(true);
    });

    test("should apply a 'filled' html class when filled is true", () => {
        const rendered: any = mount(<Badge filled={true} />);

        expect(rendered.find("span").prop("className")).toContain(
            managedClasses.badge__filled
        );
    });

    test("should apply a 'small' html class when size is small", () => {
        const rendered: any = mount(<Badge size={BadgeSize.small} />);

        expect(rendered.find("span").prop("className")).toContain(
            managedClasses.badge__small
        );
    });

    test("should apply a 'large' html class when size is large", () => {
        const rendered: any = mount(<Badge size={BadgeSize.large} />);

        expect(rendered.find("span").prop("className")).toContain(
            managedClasses.badge__large
        );
    });

    test("should apply only a 'badge' html class when no appearance is passed", () => {
        const rendered: any = mount(<Badge />);

        expect(rendered.find("span").prop("className")).toContain(managedClasses.badge);
    });
});
