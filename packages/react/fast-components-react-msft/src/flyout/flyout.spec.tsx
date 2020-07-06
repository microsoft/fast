import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { keyCodeEscape } from "@microsoft/fast-web-utilities";
import { DisplayNamePrefix } from "../utilities";
import MSFTFlyout from "./flyout";
import { FlyoutClassNameContract, FlyoutProps, FlyoutUnhandledProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("flyout", (): void => {
    const managedClasses: FlyoutClassNameContract = {
        flyout: "flyout",
        flyout__left: "flyout__left",
        flyout__right: "flyout__right",
        flyout__top: "flyout__top",
        flyout__bottom: "flyout__bottom",
        flyout__horizontalInset: "flyout__horizontalInset",
        flyout__verticalInset: "flyout__verticalInset",
    };
    const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();
    const FlyoutUpdateWrapper: (props: Omit<FlyoutProps, "anchor">) => JSX.Element = (
        props: Omit<FlyoutProps, "anchor">
    ): JSX.Element => {
        return (
            <div>
                <div ref={anchorElement} />
                <MSFTFlyout anchor={anchorElement} {...props} />
            </div>
        );
    };

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTFlyout as any).name}`).toBe(
            MSFTFlyout.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTFlyout />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", (): void => {
        const unhandledProps: FlyoutUnhandledProps = {
            "aria-disabled": false,
        };

        const rendered: any = mount(
            <MSFTFlyout
                {...unhandledProps}
                managedClasses={managedClasses}
                visible={true}
            />
        );

        expect(rendered.find(`.${managedClasses.flyout}`).prop("aria-disabled")).toEqual(
            false
        );
    });

    test("should add an `aria-label` attribute to the `flyout` element when the `label` prop is provided", () => {
        const label: string = "Flyout";
        const rendered: any = mount(
            <MSFTFlyout managedClasses={managedClasses} visible={true} label={label} />
        );

        expect(rendered.find(`.${managedClasses.flyout}`).prop("aria-label")).toEqual(
            label
        );
    });

    test("should add an `aria-labelledby` attribute to the `flyout` element when the `labelledby` prop is provided", () => {
        const labelledby: string = "id01";
        const rendered: any = mount(
            <MSFTFlyout
                managedClasses={managedClasses}
                visible={true}
                labelledBy={labelledby}
            />
        );

        expect(
            rendered.find(`.${managedClasses.flyout}`).prop("aria-labelledby")
        ).toEqual(labelledby);
    });

    test("should add an `aria-describedBy` attribute to the `flyout` element when the `describedBy` prop is provided", () => {
        const describedby: string = "Flyout";
        const rendered: any = mount(
            <MSFTFlyout
                managedClasses={managedClasses}
                visible={true}
                describedBy={describedby}
            />
        );

        expect(
            rendered.find(`.${managedClasses.flyout}`).prop("aria-describedby")
        ).toEqual(describedby);
    });

    test("should call the `onDismiss` callback after a click event on the window when `visible` prop is true", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <MSFTFlyout anchor={anchorElement} onDismiss={onDismiss} visible={true} />
            </div>
        );

        map.click({});

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should call the `onDismiss` callback when escape key is pressed and `visible` prop is true", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <MSFTFlyout anchor={anchorElement} onDismiss={onDismiss} visible={true} />
            </div>
        );

        map.keydown({ keyCode: keyCodeEscape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should remove keydown event listener for the `onDismiss` callback when component unmounts", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.removeEventListener
        window.removeEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <MSFTFlyout anchor={anchorElement} onDismiss={onDismiss} visible={true} />
            </div>
        );

        rendered.unmount();

        map.keydown({ keyCode: keyCodeEscape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should add keydown event listener for the `onDismiss` callback if `onDismiss` prop is added to the component", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(<FlyoutUpdateWrapper visible={true} />);

        // map does not exist
        expect(map["keydown"]).toBe(undefined);

        rendered.setProps({ onDismiss });

        // map exists
        map.keydown({ keyCode: keyCodeEscape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should add click event listener for the `onDismiss` callback if `onDismiss` prop is added to the component", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(<FlyoutUpdateWrapper visible={true} />);

        // map does not exist
        expect(map["click"]).toBe(undefined);

        rendered.setProps({ onDismiss });

        // map exists
        map.click({});

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should remove keydown event listener for the `onDismiss` callback if `onDismiss` prop is removed from the component", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        // Mock window.removeEventListener
        window.removeEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(
            <FlyoutUpdateWrapper onDismiss={onDismiss} visible={true} />
        );

        // map exists
        map.keydown({ keyCode: keyCodeEscape });

        expect(onDismiss).toHaveBeenCalledTimes(1);

        rendered.setProps({ onDismiss: void 0 });

        map.keydown({ keyCode: keyCodeEscape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should remove click event listener for the `onDismiss` callback if `onDismiss` prop is removed from the component", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        // Mock window.removeEventListener
        window.removeEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(
            <FlyoutUpdateWrapper onDismiss={onDismiss} visible={true} />
        );

        // map exists
        map.click({});

        expect(onDismiss).toHaveBeenCalledTimes(1);

        rendered.setProps({ onDismiss: void 0 });

        map.click({});

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(<MSFTFlyout>Children</MSFTFlyout>);

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
