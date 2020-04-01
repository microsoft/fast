import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import { TextAlignControl as StyledTextAlignControl } from "./index";
import { TextAlignControl } from "./control.text-align";
import { TextAlignControlProps } from "./control.text-align.props";
import { TextAlignControlClassNameContract } from "./control.text-align.style";
import { ControlType } from "../templates";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const textAlignControlProps: TextAlignControlProps = {
    type: ControlType.select,
    options: ["left", "center", "right"],
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
};

const managedClasses: TextAlignControlClassNameContract = {
    textAlignControl: "textAlignControl",
    textAlignControl__disabled: "textAlignControl__disabled",
    textAlignControl_input: "textAlignControl_input",
    textAlignControl_input__right: "textAlignControl_input__right",
    textAlignControl_input__center: "textAlignControl_input__center",
    textAlignControl_input__left: "textAlignControl_input__left",
};

describe("TextAlignControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<StyledTextAlignControl {...textAlignControlProps} />);
        }).not.toThrow();
    });
    test("should generate HTML input elements", () => {
        const rendered: any = mount(<TextAlignControl {...textAlignControlProps} />);

        expect(rendered.find("input")).toHaveLength(3);
    });
    test("should have an `id` attribute on the HTML input elements and a corresponding to the dataLocation", () => {
        const dataLocation: string = "foo";
        const rendered: any = mount(
            <TextAlignControl {...textAlignControlProps} dataLocation={dataLocation} />
        );
        const inputs: ShallowWrapper = rendered.find("input");

        expect(dataLocation).toMatch(inputs.at(0).prop("id"));
        expect(dataLocation).toMatch(inputs.at(1).prop("id"));
        expect(dataLocation).toMatch(inputs.at(2).prop("id"));
    });
    test("should fire an `onChange` callback when an input has been changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <TextAlignControl {...textAlignControlProps} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: "left" });
    });
    test("should be disabled if disabled props is passed", () => {
        const rendered: any = mount(
            <TextAlignControl
                {...textAlignControlProps}
                managedClasses={managedClasses}
                disabled={true}
            />
        );
        const inputs: ShallowWrapper = rendered.find("input");

        expect(inputs.at(0).prop("disabled")).toBeTruthy();
        expect(inputs.at(1).prop("disabled")).toBeTruthy();
        expect(inputs.at(2).prop("disabled")).toBeTruthy();
        expect(
            rendered.find(`.${managedClasses.textAlignControl__disabled}`)
        ).toHaveLength(1);
    });
});
