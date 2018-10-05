import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTFlipper, {
    FlipperProps,
    IFlipperHandledProps,
    IFlipperManagedClasses,
    IFlipperUnhandledProps
} from "./flipper";
import { Flipper } from "./index";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("flipper snapshots", (): void => {
    generateSnapshots(examples);
});

describe("flipper", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTFlipper as any).name).toBe(MSFTFlipper.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTFlipper />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IFlipperHandledProps = {
            visibleToAssistiveTechnologies: false
        };

        const unhandledProps: IFlipperUnhandledProps = {
            "aria-labelledby": "foo"
        };

        const props: IFlipperHandledProps & IFlipperUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = mount(
            <Flipper {...props} />
        );

        expect(rendered.find("button").props()["aria-labelledby"]).toEqual("foo");
    });

    test("should set an attribute of `tabindex` to -1 if `visibility` prop is false", () => {
        const props: IFlipperHandledProps = {
            visibleToAssistiveTechnologies: false
        };

        const rendered: any = mount(
            <Flipper {...props} />
        );

        expect(rendered.find("button").props().tabIndex).toEqual(-1);
    });

    test("should set an attribute of `aria-hidden` to true if `visibility` prop is false", () => {
        const props: IFlipperHandledProps = {
            visibleToAssistiveTechnologies: false
        };

        const rendered: any = mount(
            <Flipper {...props} />
        );

        expect(rendered.find("button").props()["aria-hidden"]).toEqual(true);
    });

    test("should not set an attribute of `aria-label` if no label is passed", () => {
        const props: IFlipperHandledProps = {
            visibleToAssistiveTechnologies: false
        };

        const rendered: any = mount(
            <Flipper {...props} />
        );

        const flipper: any = rendered.first().first();

        expect(flipper.prop("aria-label")).toBe(undefined);
    });

    test("should set an attribute of `aria-label` if `label` prop is passed", () => {
        const props: IFlipperHandledProps = {
            visibleToAssistiveTechnologies: true,
            label: "Test aria-label"
        };

        const rendered: any = mount(
            <Flipper {...props} />
        );

        const flipper: any = rendered.first().first();

        expect(rendered.prop("label")).toBe("Test aria-label");
        expect(rendered.exists(`[aria-label="${props.label}"]`)).toBe(true);
    });
});
