import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import FormItemCommon from "./form-item";
import NumberField from "./form-item.number-field";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const numberFieldProps: FormItemCommon = {
    key: "1",
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
};

describe("NumberField", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<NumberField {...numberFieldProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered: any = mount(<NumberField {...numberFieldProps} />);

        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(<NumberField {...numberFieldProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<NumberField {...numberFieldProps} />);
        const input: any = rendered.find("input").at(0);
        const label: any = rendered.find("label");

        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
    test("should fire an `onChange` callback with the input is changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <NumberField {...numberFieldProps} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change", { target: { value: 1 } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(1);
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <NumberField {...numberFieldProps} data={10} onChange={handleChange} />
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
        const data: number = 10;
        const rendered: any = mount(
            <NumberField {...numberFieldProps} data={data} onChange={handleChange} />
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
