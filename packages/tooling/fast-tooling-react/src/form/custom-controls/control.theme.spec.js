import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ThemeControl as StyledThemeControl } from "./control.theme";
import { ThemeControl } from "./control.theme";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const themeProps = {
    type: ControlType.select,
    options: ["dark", "light"],
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    value: "",
    schema: {},
    onChange: jest.fn(),
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    disabled: false,
    elementRef: null,
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
};
const managedClasses = {
    themeControl: "themeControl",
    themeControl__disabled: "themeControl__disabled",
    themeControl_input: "themeControl_input",
    themeControl_input__dark: "themeControl_input__dark",
    themeControl_input__light: "themeControl_input__light",
};
describe("ThemeControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<StyledThemeControl {...themeProps} />);
        }).not.toThrow();
    });
    test("should generate HTML input elements", () => {
        const rendered = mount(<ThemeControl {...themeProps} />);
        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should have an `id` attribute on the HTML input elements and a corresponding dataLocation", () => {
        const dataLocation = "foo";
        const rendered = mount(
            <ThemeControl {...themeProps} dataLocation={dataLocation} />
        );
        const inputs = rendered.find("input");
        expect(dataLocation).toMatch(inputs.at(0).prop("id"));
        expect(dataLocation).toMatch(inputs.at(1).prop("id"));
    });
    test("should fire an `onChange` callback when the inputs are selected", () => {
        const handleChange = jest.fn();
        const rendered = mount(<ThemeControl {...themeProps} onChange={handleChange} />);
        rendered.find("input").at(0).simulate("change");
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: "light" });
    });
    test("should be disabled if disabled props is passed", () => {
        const rendered = mount(
            <ThemeControl
                {...themeProps}
                managedClasses={managedClasses}
                disabled={true}
            />
        );
        const inputs = rendered.find("input");
        expect(inputs.at(0).prop("disabled")).toBeTruthy();
        expect(inputs.at(1).prop("disabled")).toBeTruthy();
        expect(rendered.find(`.${managedClasses.themeControl__disabled}`)).toHaveLength(
            1
        );
    });
});
