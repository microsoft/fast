import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import BadgeControl from "./badge-control";
import { BadgeControlProps } from "./badge.props";
import { BadgeType } from "./form-item.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("BadgeControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<BadgeControl type={BadgeType.info} />);
        }).not.toThrow();
    });
    test("should return the `InfoBadge` if the type is `info`", () => {
        const props: BadgeControlProps = {
            type: BadgeType.info,
        };

        const rendered: any = mount(<BadgeControl {...props} />);

        expect(rendered.find("InfoBadge")).toHaveLength(1);
    });
    test("should return the `WarningBadge` if the type is `warning`", () => {
        const props: BadgeControlProps = {
            type: BadgeType.warning,
        };

        const rendered: any = mount(<BadgeControl {...props} />);

        expect(rendered.find("WarningBadge")).toHaveLength(1);
    });
    test("should return the `LockedBadge` if the type is `locked`", () => {
        const props: BadgeControlProps = {
            type: BadgeType.locked,
        };

        const rendered: any = mount(<BadgeControl {...props} />);

        expect(rendered.find("LockedBadge")).toHaveLength(1);
    });
    test("should pass the className", () => {
        const className: string = "foo";
        const props: BadgeControlProps = {
            type: BadgeType.locked,
            className,
        };

        const rendered: any = mount(<BadgeControl {...props} />);

        expect(rendered.props().className).toEqual(className);
    });
    test("should pass the description", () => {
        const description: string = "bar";
        const props: BadgeControlProps = {
            type: BadgeType.locked,
            description,
        };

        const rendered: any = mount(<BadgeControl {...props} />);

        expect(rendered.props().description).toEqual(description);
    });
});
