import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { Orientation, RotateHandledProps } from "./";
import RotateBase from "./rotate.base";
import { RotateClassNameContract } from "./rotate";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Rotate", (): void => {
    const managedClasses: RotateClassNameContract = {
        rotate: "rotate",
    };

    test("should create two radios for the landscape and portrait orientations", () => {
        const props: RotateHandledProps = {
            orientation: Orientation.landscape,
            onUpdateOrientation: jest.fn(),
        };
        const rendered: any = mount(
            <RotateBase managedClasses={managedClasses} {...props} />
        );

        expect(rendered.find("input").length).toBe(2);
    });
    test("should have the landscape radio be checked when the `orientation` prop is set to landscape", () => {
        const props: RotateHandledProps = {
            orientation: Orientation.landscape,
            onUpdateOrientation: jest.fn(),
        };
        const rendered: any = mount(
            <RotateBase managedClasses={managedClasses} {...props} />
        );

        rendered.find("input").forEach(
            (input: any, index: number): void => {
                if (index === 0) {
                    expect(input.prop("checked")).toEqual(true);
                } else {
                    expect(input.prop("checked")).toEqual(false);
                }
            }
        );
    });
    test("should have the portrait radio be checked when the `orientation` prop is set to portrait", () => {
        const props: RotateHandledProps = {
            orientation: Orientation.portrait,
            onUpdateOrientation: jest.fn(),
        };
        const rendered: any = mount(
            <RotateBase managedClasses={managedClasses} {...props} />
        );

        rendered.find("input").forEach(
            (input: any, index: number): void => {
                if (index === 0) {
                    expect(input.prop("checked")).toEqual(false);
                } else {
                    expect(input.prop("checked")).toEqual(true);
                }
            }
        );
    });
    test("should fire the `onUpdateOrientation` when a radio has been selected and return the updated orientation", () => {
        const updateOrientationCallback: (orientation: Orientation) => void = jest.fn(
            function(orientation: Orientation): void {
                expect(orientation).toBe(Orientation.landscape);
            }
        );
        const props: RotateHandledProps = {
            orientation: Orientation.portrait,
            onUpdateOrientation: updateOrientationCallback,
        };
        const rendered: any = mount(
            <RotateBase managedClasses={managedClasses} {...props} />
        );

        rendered.find("span").forEach(
            (span: any, index: number): void => {
                if (index === 0) {
                    span.simulate("click");
                }
            }
        );

        expect(updateOrientationCallback).toHaveBeenCalled();
    });
    test("should set the landscape radio to disabled when the `landscapeDisabled` prop is true", () => {
        const props: RotateHandledProps = {
            orientation: Orientation.portrait,
            onUpdateOrientation: jest.fn(),
            landscapeDisabled: true,
        };
        const rendered: any = mount(
            <RotateBase managedClasses={managedClasses} {...props} />
        );

        rendered.find("input").forEach(
            (input: any, index: number): void => {
                if (index === 0) {
                    expect(input.prop("disabled")).toEqual(true);
                } else {
                    expect(input.prop("disabled")).toEqual(undefined);
                }
            }
        );
    });
    test("should set the portrait radio to disabled when the `portraitDisabled` prop is true", () => {
        const props: RotateHandledProps = {
            orientation: Orientation.portrait,
            onUpdateOrientation: jest.fn(),
            portraitDisabled: true,
        };
        const rendered: any = mount(
            <RotateBase managedClasses={managedClasses} {...props} />
        );

        rendered.find("input").forEach(
            (input: any, index: number): void => {
                if (index === 0) {
                    expect(input.prop("disabled")).toEqual(undefined);
                } else {
                    expect(input.prop("disabled")).toEqual(true);
                }
            }
        );
    });
});
