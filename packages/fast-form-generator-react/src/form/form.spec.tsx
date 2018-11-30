import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Form from "./form";
import { FormProps } from "./form.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formProps: FormProps = {
    childOptions: [],
    schema: {},
    data: "",
    onChange: jest.fn(),
};

describe("Form", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Form {...formProps} />);
        }).not.toThrow();
    });
});
