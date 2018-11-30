import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
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
    key: "1",
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

        expect(rendered.find("input")).toHaveLength(2);
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
});
