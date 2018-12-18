import React from "react";
import Adapter from "enzyme-adapter-react-16";
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

        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should generate a label HTML element", () => {
        const rendered: any = mount(<Checkbox {...checkboxProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<Checkbox {...checkboxProps} />);
        const input: any = rendered.find("input").at(0);
        const label: any = rendered.find("label");

        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Checkbox {...checkboxProps} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { checked: true } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(true);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(<Checkbox {...checkboxProps} disabled={true} />);

        const input: any = rendered.find("input");

        expect(rendered).toHaveLength(1);
        expect(rendered.prop("disabled")).toBeTruthy();
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Checkbox {...checkboxProps} data={true} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(1)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: boolean = true;
        const rendered: any = mount(
            <Checkbox {...checkboxProps} data={data} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(1)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find("input")
            .at(1)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
});
