import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Array, { FormItemArrayProps } from "./form-item.array";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const arrayProps: FormItemArrayProps = {
    key: "1",
    untitled: "",
    index: 1,
    dataLocation: "",
    schemaLocation: "",
    data: "",
    schema: {},
    required: false,
    label: "",
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
};

describe("Array", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<Array {...arrayProps} />);
        }).not.toThrow();
    });
});
