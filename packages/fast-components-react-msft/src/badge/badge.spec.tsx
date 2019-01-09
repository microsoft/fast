import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTBadge from "./badge";
import {
    Badge,
    BadgeAppearance,
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
        badge__lowlight: "badge__lowlight",
        badge__highlight: "badge__highlight",
        badge__accent: "badge__accent",
    };

    test("should have a displayName that matches the component name", () => {
        expect((MSFTBadge as any).name).toBe(MSFTBadge.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTBadge />);
            shallow(<MSFTBadge appearance={BadgeAppearance.lowlight} />);
            shallow(<MSFTBadge appearance={BadgeAppearance.highlight} />);
            shallow(<MSFTBadge appearance={BadgeAppearance.lightweight} />);
            shallow(<MSFTBadge appearance={BadgeAppearance.accent} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: BadgeHandledProps = {
            size: BadgeSize.small,
            appearance: BadgeAppearance.lowlight,
        };

        const unhandledProps: BadgeUnhandledProps = {
            "aria-hidden": true,
        };

        const props: BadgeProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<Badge {...props} />);

        expect(rendered.find("span").prop("aria-hidden")).toEqual(true);
    });

    test("should apply a 'lowlight' html class when appearance is lowlight", () => {
        const rendered: any = mount(<Badge appearance={BadgeAppearance.lowlight} />);

        expect(rendered.find("span").prop("className")).toContain(
            managedClasses.badge__lowlight
        );
    });

    test("should apply a 'highlight' html class when appearance is highlight", () => {
        const rendered: any = mount(<Badge appearance={BadgeAppearance.highlight} />);

        expect(rendered.find("span").prop("className")).toContain(
            managedClasses.badge__highlight
        );
    });

    test("should apply an 'accent' html class when appearance is accent", () => {
        const rendered: any = mount(<Badge appearance={BadgeAppearance.accent} />);

        expect(rendered.find("span").prop("className")).toContain(
            managedClasses.badge__accent
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
});
