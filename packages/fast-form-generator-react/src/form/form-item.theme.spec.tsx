import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Theme from "./form-item.theme";
import { FormItemComponentMappingToProperyNamesProps, mappingName } from "./form-item";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const themeProps: FormItemComponentMappingToProperyNamesProps = {
    name: mappingName.theme,
    options: ["dark", "light"],
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
};

describe("Theme", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Theme {...themeProps} />);
        }).not.toThrow();
    });
    test("should generate HTML input elements", () => {
        const rendered: any = mount(<Theme {...themeProps} />);

        expect(rendered.find("input")).toHaveLength(3);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(<Theme {...themeProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input elements and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<Theme {...themeProps} />);
        const inputs: any = rendered.find("input");
        const label: any = rendered.find("label");

        expect(label.prop("htmlFor")).toMatch(inputs.at(0).prop("id"));
        expect(label.prop("htmlFor")).toMatch(inputs.at(1).prop("id"));
    });
    test("should fire an `onChange` callback when the inputs are selected", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(<Theme {...themeProps} onChange={handleChange} />);

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual("light");
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <Theme {...themeProps} data={"light"} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(2)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "light";
        const rendered: any = mount(
            <Theme {...themeProps} data={data} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(2)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find("input")
            .at(2)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
});
