import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import InfoBadge from "./badge.info";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("InfoBadge", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<InfoBadge />);
        }).not.toThrow();
    });
    test("should create an SVG element", () => {
        const rendered: any = mount(<InfoBadge />);

        expect(rendered.find("svg")).toHaveLength(1);
    });
    test("should create an SVG title element if a description has been passed", () => {
        const description: string = "foo";
        const rendered: any = mount(<InfoBadge description={description} />);
        const title: any = rendered.find("title");

        expect(title).toHaveLength(1);
        expect(title.text()).toEqual(description);
    });
    test("should add a `className` to an SVG element if it has been passed", () => {
        const className: string = "bar";
        const rendered: any = mount(<InfoBadge className={className} />);

        expect(rendered.find("svg").props().className).toEqual(className);
    });
});
