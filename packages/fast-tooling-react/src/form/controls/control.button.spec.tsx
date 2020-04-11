import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ButtonControl } from "./control.button";
import { ButtonControlProps } from "./control.button.props";
import { ButtonControlClassNameContract } from "./control.button.style";
import { ControlType } from "../templates";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: ButtonControlClassNameContract = {
    buttonControl: "buttonControl-class",
    buttonControl__disabled: "buttonControl__disabled-class",
    buttonControl__default: "buttonControl__default-class",
};

const buttonProps: ButtonControlProps = {
    type: ControlType.button,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    onChange: jest.fn(),
    value: "",
    schema: {},
    disabled: false,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    elementRef: null,
    validationErrors: [],
    required: false,
    messageSystem: void 0,
};

describe("ButtonControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<ButtonControl {...buttonProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML button element", () => {
        const rendered: any = mount(
            <ButtonControl {...buttonProps} managedClasses={managedClasses} />
        );

        expect(rendered.find("button")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered: any = mount(
            <ButtonControl
                {...buttonProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find(`.${managedClasses.buttonControl__disabled}`)).toHaveLength(
            1
        );
        expect(rendered.find("button").prop("disabled")).toBeTruthy();
        expect(rendered.find("input").prop("disabled")).toBeTruthy();
    });
    test("should have the default class when default prop is passed", () => {
        const rendered: any = mount(
            <ButtonControl
                {...buttonProps}
                value={undefined}
                default={null}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.find(`.${managedClasses.buttonControl__default}`)).toHaveLength(
            1
        );
    });
    test("should fire the onChange event when the button is clicked", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ButtonControl
                {...buttonProps}
                managedClasses={managedClasses}
                value={undefined}
                onChange={callback}
            />
        );

        expect(callback).toHaveBeenCalledTimes(0);

        rendered.find(`.${managedClasses.buttonControl}`).simulate("click");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ value: null });
    });
    test("should NOT fire an onChange when the input value is updated", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <ButtonControl
                {...buttonProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );

        rendered.find("input").simulate("change", { target: { value: "foo" } });

        expect(callback).toHaveBeenCalledTimes(0);
    });
});
