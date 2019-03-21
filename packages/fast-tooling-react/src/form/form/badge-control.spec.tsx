import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import BadgeControl from "./badge-control";
import { BadgeControlProps } from "./badge-control.props";
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
    test("should create an SVG title element if a description has been passed", () => {
        const description: string = "foo";
        const rendered: any = mount(
            <BadgeControl type={BadgeType.info} description={description} />
        );
        const title: any = rendered.find("title");

        expect(title).toHaveLength(1);
        expect(title.text()).toEqual(description);
    });
    test("should add a `className` to an SVG element if it has been passed", () => {
        const className: string = "bar";
        const rendered: any = mount(
            <BadgeControl type={BadgeType.info} className={className} />
        );

        expect(rendered.find("svg").props().className).toEqual(className);
    });
});
