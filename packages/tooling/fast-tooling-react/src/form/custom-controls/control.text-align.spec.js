import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { TextAlignControl as StyledTextAlignControl } from "./index";
import { TextAlignControl } from "./control.text-align";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const textAlignControlProps = {
    type: ControlType.select,
    options: ["left", "center", "right", "justify"],
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    value: "",
    schema: {},
    onChange: jest.fn(),
    disabled: false,
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
};
const managedClasses = {
    textAlignControl: "textAlignControl",
    textAlignControl__disabled: "textAlignControl__disabled",
    textAlignControl_input: "textAlignControl_input",
    textAlignControl_input__right: "textAlignControl_input__right",
    textAlignControl_input__center: "textAlignControl_input__center",
    textAlignControl_input__left: "textAlignControl_input__left",
    textAlignControl_input__justify: "textAlignControl_input__justify",
};
describe("TextAlignControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<StyledTextAlignControl {...textAlignControlProps} />);
        }).not.toThrow();
    });
    test("should generate HTML input elements", () => {
        const rendered = mount(<TextAlignControl {...textAlignControlProps} />);
        expect(rendered.find("input")).toHaveLength(4);
    });
    test("should have an `id` attribute on the HTML input elements and a corresponding to the dataLocation", () => {
        const dataLocation = "foo";
        const rendered = mount(
            <TextAlignControl {...textAlignControlProps} dataLocation={dataLocation} />
        );
        const inputs = rendered.find("input");
        expect(dataLocation).toMatch(inputs.at(0).prop("id"));
        expect(dataLocation).toMatch(inputs.at(1).prop("id"));
        expect(dataLocation).toMatch(inputs.at(2).prop("id"));
        expect(dataLocation).toMatch(inputs.at(3).prop("id"));
    });
    test("should fire an `onChange` callback when an input has been changed", () => {
        const handleChange = jest.fn();
        const rendered = mount(
            <TextAlignControl {...textAlignControlProps} onChange={handleChange} />
        );
        rendered.find("input").at(0).simulate("change");
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: "left" });
    });
    test("should be disabled if disabled props is passed", () => {
        const rendered = mount(
            <TextAlignControl
                {...textAlignControlProps}
                managedClasses={managedClasses}
                disabled={true}
            />
        );
        const inputs = rendered.find("input");
        expect(inputs.at(0).prop("disabled")).toBeTruthy();
        expect(inputs.at(1).prop("disabled")).toBeTruthy();
        expect(inputs.at(2).prop("disabled")).toBeTruthy();
        expect(inputs.at(3).prop("disabled")).toBeTruthy();
        expect(
            rendered.find(`.${managedClasses.textAlignControl__disabled}`)
        ).toHaveLength(1);
    });
});
