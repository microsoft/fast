import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Select, { FormItemSelectProps } from "./form-item.select";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const selectProps: FormItemSelectProps = {
    key: "1",
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    options: [],
    onChange: jest.fn(),
};

describe("Select", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Select {...selectProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML select element", () => {
        const rendered: any = mount(<Select {...selectProps} />);

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should not generate an HTML select element when there is only one option and select is required", () => {
        const rendered: any = mount(
            <Select {...selectProps} options={["foo"]} required={true} />
        );

        expect(rendered.find("select")).toHaveLength(0);
    });
    xtest("should generate an HTML select element when there is only one option and select is optional", () => {
        const rendered: any = mount(<Select {...selectProps} options={["foo"]} />);

        expect(rendered.find("select")).toHaveLength(1);
    });
    test("should generate HTML options for each passed option", () => {
        const renderedNoOptions: any = mount(<Select {...selectProps} />);

        expect(renderedNoOptions.find("option")).toHaveLength(0);

        const renderedOptions: any = mount(
            <Select {...selectProps} options={["foo", "bar"]} />
        );

        expect(renderedOptions.find("option")).toHaveLength(2);
    });
    test("should generate an HTML label", () => {
        const rendered: any = mount(<Select {...selectProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should fire an `onChange` callback when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <Select {...selectProps} onChange={handleChange} options={["foo", "bar"]} />
        );

        const selectElement: any = rendered.find("select");

        selectElement.simulate("change", { target: { value: "bar" } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual("");
        expect(handleChange.mock.calls[0][1]).toEqual("bar");
    });
    test("should fire an `onChange` callback with numbers as values when a different option is selected", () => {
        const handleChange: any = jest.fn();

        const rendered: any = mount(
            <Select {...selectProps} onChange={handleChange} options={[1, 2]} />
        );

        const selectElement: any = rendered.find("select");

        selectElement.simulate("change", { target: { value: 2 } });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual("");
        expect(handleChange.mock.calls[0][1]).toEqual(2);
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Select
                {...selectProps}
                data={"foo"}
                options={["foo", "bar"]}
                onChange={handleChange}
            />
        );

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "foo";
        const rendered: any = mount(
            <Select
                {...selectProps}
                data={data}
                options={["foo", "bar"]}
                onChange={handleChange}
            />
        );

        rendered.find("input").simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered.find("input").simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
});
