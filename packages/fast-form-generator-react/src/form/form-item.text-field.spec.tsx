import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import TextField, { FormItemTextFieldProps } from "./form-item.text-field";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const textFieldProps: FormItemTextFieldProps = {
    type: "string",
    key: "1",
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
};

describe("TextField", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<TextField {...textFieldProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered: any = mount(<TextField {...textFieldProps} />);

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(<TextField {...textFieldProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<TextField {...textFieldProps} />);
        const label: any = rendered.find("label");
        const input: any = rendered.find("input");

        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback when the HTML input element value is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <TextField {...textFieldProps} onChange={handleChange} />
        );

        rendered.find("input").simulate("change", { target: { value: "foo" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual("foo");
    });
});
