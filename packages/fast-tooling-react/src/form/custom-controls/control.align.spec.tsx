import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import { AlignControl as StyledAlignControl, AlignControlProps } from "./index";
import { Alignment } from "./control.align.props";
import { AlignControl } from "./control.align";
import { AlignControlClassNameContract } from "./control.align.style";
import { ControlType } from "../templates";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const alignControlProps: AlignControlProps = {
    type: ControlType.select,
    options: [Alignment.top, Alignment.center, Alignment.bottom],
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

const managedClasses: AlignControlClassNameContract = {
    alignControl: "alignControl",
    alignControl__disabled: "alignControl__disabled",
    alignControl_input: "alignControl_input",
    alignControl_input__bottom: "alignControl_input__bottom",
    alignControl_input__center: "alignControl_input__center",
    alignControl_input__top: "alignControl_input__top",
};

describe("AlignControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<StyledAlignControl {...alignControlProps} />);
        }).not.toThrow();
    });
    test("should generate HTML input elements", () => {
        const rendered: any = mount(<AlignControl {...alignControlProps} />);

        expect(rendered.find("input")).toHaveLength(3);
    });
    test("should have an `id` attribute on the HTML input elements corresponding to the dataLocation", () => {
        const dataLocation: string = "foo";
        const rendered: any = mount(
            <AlignControl dataLocation={dataLocation} {...alignControlProps} />
        );
        const inputs: any = rendered.find("input");

        expect(dataLocation).toMatch(inputs.at(0).prop("id"));
        expect(dataLocation).toMatch(inputs.at(1).prop("id"));
        expect(dataLocation).toMatch(inputs.at(2).prop("id"));
    });
    test("should fire an `onChange` callback when an input has been changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <AlignControl {...alignControlProps} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toEqual({ value: "top" });
    });
    test("should be disabled if disabled props is passed", () => {
        const rendered: any = mount(
            <AlignControl
                {...alignControlProps}
                managedClasses={managedClasses}
                disabled={true}
            />
        );
        const inputs: ShallowWrapper = rendered.find("input");

        expect(inputs.at(0).prop("disabled")).toBeTruthy();
        expect(inputs.at(1).prop("disabled")).toBeTruthy();
        expect(inputs.at(2).prop("disabled")).toBeTruthy();
        expect(rendered.find(`.${managedClasses.alignControl__disabled}`)).toHaveLength(
            1
        );
    });
});
