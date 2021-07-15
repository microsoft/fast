import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { DisplayControl } from "./control.display";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const managedClasses = {
    displayControl: "displayControl",
    displayControl__disabled: "displayControl__disabled",
    displayControl__default: "displayControl__default",
};
const displayProps = {
    type: ControlType.display,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    value: "",
    schema: {},
    disabled: false,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    onChange: jest.fn(),
    elementRef: null,
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
};
describe("DisplayControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<DisplayControl {...displayProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered = mount(
            <DisplayControl {...displayProps} managedClasses={managedClasses} />
        );
        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should be disabled when disabled props is passed", () => {
        const rendered = mount(
            <DisplayControl
                {...displayProps}
                disabled={true}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find(`.${managedClasses.displayControl__disabled}`)).toHaveLength(
            1
        );
        expect(rendered.find("input").prop("disabled")).toBeTruthy();
    });
    test("should have the default class when default prop is passed", () => {
        const rendered = mount(
            <DisplayControl
                {...displayProps}
                value={undefined}
                default={"foo"}
                managedClasses={managedClasses}
            />
        );
        expect(rendered.find(`.${managedClasses.displayControl__default}`)).toHaveLength(
            1
        );
    });
    test("should show default values if they exist and no data is available", () => {
        const defaultValue = "bar";
        const rendered = mount(
            <DisplayControl
                {...displayProps}
                managedClasses={managedClasses}
                value={undefined}
                default={defaultValue}
            />
        );
        expect(rendered.find(`.${managedClasses.displayControl}`).prop("value")).toBe(
            defaultValue
        );
    });
    test("should show non-string default values if they exist and no data is available", () => {
        const defaultValue = 50;
        const rendered = mount(
            <DisplayControl
                {...displayProps}
                managedClasses={managedClasses}
                value={undefined}
                default={defaultValue}
            />
        );
        expect(rendered.find(`.${managedClasses.displayControl}`).prop("value")).toBe(
            JSON.stringify(defaultValue, null, 2)
        );
    });
    test("should not show default values if data exists", () => {
        const value = "foo";
        const defaultValue = "bar";
        const rendered = mount(
            <DisplayControl
                {...displayProps}
                managedClasses={managedClasses}
                value={value}
                default={defaultValue}
            />
        );
        expect(rendered.find(`.${managedClasses.displayControl}`).prop("value")).toBe(
            value
        );
    });
    test("should NOT fire an onChange when the input value is updated", () => {
        const callback = jest.fn();
        const rendered = mount(
            <DisplayControl
                {...displayProps}
                onChange={callback}
                managedClasses={managedClasses}
            />
        );
        rendered.find("input").simulate("change", { target: { value: "foo" } });
        expect(callback).toHaveBeenCalledTimes(0);
    });
});
