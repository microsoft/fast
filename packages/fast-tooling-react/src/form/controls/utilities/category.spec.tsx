import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Category from "./category";
import { CategoryProps } from "./category.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const categoryProps: CategoryProps = {
    title: "Category",
};

describe("Category", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Category {...categoryProps} />);
        }).not.toThrow();
    });
});
