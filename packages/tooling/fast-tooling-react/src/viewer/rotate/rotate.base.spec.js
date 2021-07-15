import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { Orientation } from "./";
import { Rotate } from "./rotate.base";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
describe("Rotate", () => {
    const managedClasses = {
        rotate: "rotate",
    };
    test("should create two radios for the landscape and portrait orientations", () => {
        const props = {
            orientation: Orientation.landscape,
            onUpdateOrientation: jest.fn(),
        };
        const rendered = mount(<Rotate managedClasses={managedClasses} {...props} />);
        expect(rendered.find("input").length).toBe(2);
    });
    test("should have the landscape radio be checked when the `orientation` prop is set to landscape", () => {
        const props = {
            orientation: Orientation.landscape,
            onUpdateOrientation: jest.fn(),
        };
        const rendered = mount(<Rotate managedClasses={managedClasses} {...props} />);
        rendered.find("input").forEach((input, index) => {
            if (index === 0) {
                expect(input.prop("checked")).toEqual(true);
            } else {
                expect(input.prop("checked")).toEqual(false);
            }
        });
    });
    test("should have the portrait radio be checked when the `orientation` prop is set to portrait", () => {
        const props = {
            orientation: Orientation.portrait,
            onUpdateOrientation: jest.fn(),
        };
        const rendered = mount(<Rotate managedClasses={managedClasses} {...props} />);
        rendered.find("input").forEach((input, index) => {
            if (index === 0) {
                expect(input.prop("checked")).toEqual(false);
            } else {
                expect(input.prop("checked")).toEqual(true);
            }
        });
    });
    test("should fire the `onUpdateOrientation` when a radio has been selected and return the updated orientation", () => {
        const updateOrientationCallback = jest.fn(function (orientation) {
            expect(orientation).toBe(Orientation.landscape);
        });
        const props = {
            orientation: Orientation.portrait,
            onUpdateOrientation: updateOrientationCallback,
        };
        const rendered = mount(<Rotate managedClasses={managedClasses} {...props} />);
        rendered.find("input").forEach((input, index) => {
            if (index === 0) {
                input.simulate("change");
            }
        });
        expect(updateOrientationCallback).toHaveBeenCalled();
    });
    test("should set the landscape radio to disabled when the `landscapeDisabled` prop is true", () => {
        const props = {
            orientation: Orientation.portrait,
            onUpdateOrientation: jest.fn(),
            landscapeDisabled: true,
        };
        const rendered = mount(<Rotate managedClasses={managedClasses} {...props} />);
        rendered.find("input").forEach((input, index) => {
            if (index === 0) {
                expect(input.prop("disabled")).toEqual(true);
            } else {
                expect(input.prop("disabled")).toEqual(undefined);
            }
        });
    });
    test("should set the portrait radio to disabled when the `portraitDisabled` prop is true", () => {
        const props = {
            orientation: Orientation.portrait,
            onUpdateOrientation: jest.fn(),
            portraitDisabled: true,
        };
        const rendered = mount(<Rotate managedClasses={managedClasses} {...props} />);
        rendered.find("input").forEach((input, index) => {
            if (index === 0) {
                expect(input.prop("disabled")).toEqual(undefined);
            } else {
                expect(input.prop("disabled")).toEqual(true);
            }
        });
    });
});
