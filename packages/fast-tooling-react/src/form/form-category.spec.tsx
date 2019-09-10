import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import FormCategory from "./form-category";
import { FormCategoryProps } from "./form-category.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formCategoryProps: FormCategoryProps = {
    title: "",
    id: "Foo",
};

describe("FormCategory", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<FormCategory {...formCategoryProps} />);
        }).not.toThrow();
    });
});
