import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Textarea, { FormItemTextareaProps } from "./form-item.textarea";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const textareaProps: FormItemTextareaProps = {
    key: "1",
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
};

describe("Textarea", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Textarea {...textareaProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML textarea element", () => {
        const rendered: any = mount(<Textarea {...textareaProps} />);

        expect(rendered.find("textarea")).toHaveLength(1);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(<Textarea {...textareaProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML textarea element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<Textarea {...textareaProps} />);
        const label: any = rendered.find("label");
        const textarea: any = rendered.find("textarea");

        expect(label.prop("htmlFor")).toMatch(textarea.prop("id"));
    });
    test("should fire an `onChange` callback when the textarea value is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Textarea {...textareaProps} onChange={handleChange} />
        );

        rendered.find("textarea").simulate("change", { target: { value: "foo" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual("foo");
    });
});
