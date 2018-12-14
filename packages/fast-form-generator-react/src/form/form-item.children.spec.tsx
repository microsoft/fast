import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Children, { FormItemChildrenProps } from "./form-item.children";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const childrenProps: FormItemChildrenProps = {
    title: "",
    childOptions: [],
    schema: {},
    dataLocation: "",
    data: "",
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
};

describe("Children", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Children {...childrenProps} />);
        }).not.toThrow();
    });
});
