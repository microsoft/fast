import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import FormItemCommon from "./form-item";
import Checkbox from "./form-item.checkbox";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const checkboxProps: FormItemCommon = {
    key: "1",
    index: 1,
    dataLocation: "",
    data: false,
    required: false,
    label: "",
    onChange: jest.fn(),
};

describe("Checkbox", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Checkbox {...checkboxProps} />);
        }).not.toThrow();
    });
    test("should generate an input HTML element", () => {
        const rendered: any = mount(<Checkbox {...checkboxProps} />);

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should generate a label HTML element", () => {
        const rendered: any = mount(<Checkbox {...checkboxProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<Checkbox {...checkboxProps} />);
        const input: any = rendered.find("input");
        const label: any = rendered.find("label");

        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Checkbox {...checkboxProps} onChange={handleChange} />
        );

        rendered.find("input").simulate("change", { target: { checked: true } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(true);
    });
});
