import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Textarea from "./form-item.textarea";
import { FormItemTextareaProps } from "./form-item.textarea.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const textareaProps: FormItemTextareaProps = {
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    invalidMessage: "",
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
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Textarea {...textareaProps} data={"foo"} onChange={handleChange} />
        );

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <Textarea {...textareaProps} data={"foo"} disabled={true} />
        );
        const wrapper: any = rendered.find("textarea");

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("disabled")).toBeTruthy();
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "foo";
        const rendered: any = mount(
            <Textarea {...textareaProps} data={data} onChange={handleChange} />
        );

        rendered.find("input").simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
    test("should not show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is undefined", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <Textarea {...textareaProps} data={"foo"} invalidMessage={invalidMessage} />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(false);
    });
    test("should show an invalid message inline if `invalidMessage` is passed and `displayValidationInline` is true", () => {
        const invalidMessage: string = "Foo";
        const rendered: any = mount(
            <Textarea
                {...textareaProps}
                data={"foo"}
                invalidMessage={invalidMessage}
                displayValidationInline={true}
            />
        );

        expect(rendered.html().includes(invalidMessage)).toBe(true);
    });
});
