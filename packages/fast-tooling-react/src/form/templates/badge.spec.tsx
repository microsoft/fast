import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Badge from "./badge";
import { BadgeType } from "./types";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Badge", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Badge type={BadgeType.info} />);
        }).not.toThrow();
    });
    test("should create an SVG title element if a description has been passed", () => {
        const description: string = "foo";
        const rendered: any = mount(
            <Badge type={BadgeType.info} description={description} />
        );
        const title: any = rendered.find("title");

        expect(title).toHaveLength(1);
        expect(title.text()).toEqual(description);
    });
    test("should add a `className` to an SVG element if it has been passed", () => {
        const className: string = "bar";
        const rendered: any = mount(
            <Badge type={BadgeType.info} className={className} />
        );

        expect(rendered.find("svg").props().className).toEqual(className);
    });
    test("should create an SVG if the info badge type has been passed", () => {
        const rendered: any = mount(<Badge type={BadgeType.info} />);

        expect(rendered.find("svg")).toHaveLength(1);
    });
    test("should create an SVG if the locked badge type has been passed", () => {
        const rendered: any = mount(<Badge type={BadgeType.locked} />);

        expect(rendered.find("svg")).toHaveLength(1);
    });
    test("should create an SVG if the warning badge type has been passed", () => {
        const rendered: any = mount(<Badge type={BadgeType.warning} />);

        expect(rendered.find("svg")).toHaveLength(1);
    });
    test("should not create an SVG no badge type has been passed", () => {
        const rendered: any = mount(<Badge type={void 0} />);

        expect(rendered.find("svg")).toHaveLength(0);
    });
});
