import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { SelectDeviceHandledProps } from "./";
import SelectDeviceBase from "./select-device.base";
import { Display } from "./devices";
import { SelectDeviceClassNameContract } from "./select-device.class-name-contract";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("SelectDevice", (): void => {
    const managedClasses: SelectDeviceClassNameContract = {
        selectDevice: "select-device",
    };

    test("should create an HTML select element", () => {
        const props: SelectDeviceHandledProps = {
            devices: [],
            activeDeviceId: void 0,
            onUpdateDevice: jest.fn(),
        };
        const rendered: any = mount(
            <SelectDeviceBase managedClasses={managedClasses} {...props} />
        );

        expect(rendered.find("select").length).toBe(1);
    });
    test("should create a label if the label prop is passed", () => {
        const propsWithLabel: SelectDeviceHandledProps = {
            label: "label",
            devices: [],
            activeDeviceId: void 0,
            onUpdateDevice: jest.fn(),
        };
        const renderedWithLabel: any = mount(
            <SelectDeviceBase managedClasses={managedClasses} {...propsWithLabel} />
        );
        const propsWithoutLabel: SelectDeviceHandledProps = {
            devices: [],
            activeDeviceId: void 0,
            onUpdateDevice: jest.fn(),
        };
        const renderedWithoutLabel: any = mount(
            <SelectDeviceBase managedClasses={managedClasses} {...propsWithoutLabel} />
        );

        expect(renderedWithLabel.find("label").length).toBe(1);
        expect(renderedWithoutLabel.find("label").length).toBe(0);
    });
    test("should create a series of select options that match the `devices` prop", () => {
        const props: SelectDeviceHandledProps = {
            devices: [
                {
                    id: "testDevice1",
                    displayName: "test-device-1",
                    display: Display.responsive,
                },
                {
                    id: "testDevice2",
                    displayName: "test-device-2",
                    display: Display.fixed,
                    height: 200,
                    width: 400,
                },
            ],
            activeDeviceId: "testDevice1",
            onUpdateDevice: jest.fn(),
        };
        const rendered: any = mount(
            <SelectDeviceBase managedClasses={managedClasses} {...props} />
        );

        expect(rendered.find("option").length).toBe(2);
    });
    test("should set the value of the select element to match the `activeDeviceId` prop", () => {
        const props: SelectDeviceHandledProps = {
            devices: [],
            activeDeviceId: void 0,
            onUpdateDevice: jest.fn(),
        };
        const rendered: any = mount(
            <SelectDeviceBase managedClasses={managedClasses} {...props} />
        );

        expect(rendered.find("select").prop("value")).toEqual(undefined);
    });
    test("should fire the `onUpdateDevice` callback when an option has been selected and return the updated device index", () => {
        const updateDeviceCallback: (activeDeviceId: string) => void = jest.fn(function(
            activeDeviceId: string
        ): void {
            expect(activeDeviceId).toEqual("testDevice2");
        });
        const props: SelectDeviceHandledProps = {
            devices: [
                {
                    id: "testDevice1",
                    displayName: "test-device-1",
                    display: Display.responsive,
                },
                {
                    id: "testDevice2",
                    displayName: "test-device-2",
                    display: Display.fixed,
                    height: 200,
                    width: 400,
                },
            ],
            activeDeviceId: "testDevice1",
            onUpdateDevice: updateDeviceCallback,
        };
        const rendered: any = mount(
            <SelectDeviceBase managedClasses={managedClasses} {...props} />
        );
        rendered.find("select").simulate("change", { target: { value: "testDevice2" } });

        expect(updateDeviceCallback).toHaveBeenCalled();
    });
});
