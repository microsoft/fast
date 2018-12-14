import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import FormCategory, { FormCategoryProps } from "./form-category";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formCategoryProps: FormCategoryProps = {
    categoryItem: [<div key="1">foo</div>, <div key="2">bar</div>],
    title: "",
};

describe("FormCategory", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<FormCategory {...formCategoryProps} />);
        }).not.toThrow();
    });
});
