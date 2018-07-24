import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    FlipperProps,
    IFlipperHandledProps,
    IFlipperManagedClasses,
    IFlipperUnhandledProps
} from "./flipper";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("flipper snapshots", (): void => {
    generateSnapshots(examples);
});

describe("flipper", (): void => {
    const Component: React.ComponentClass<IFlipperHandledProps> = examples.component;

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IFlipperHandledProps = {
            visible: false
        };

        const unhandledProps: IFlipperUnhandledProps = {
            "aria-labelledby": "foo"
        };

        const props: IFlipperHandledProps & IFlipperUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        const flipper: any = rendered.first().shallow();

        expect(flipper.prop("aria-labelledby")).toEqual("foo");
    });

    test("should set an attribute of `tabindex` to -1 if `visibility` prop is false", () => {
        const props: IFlipperHandledProps = {
            visible: false
        };

        const rendered: any = shallow(
            <Component {...props} />
        );

        const flipper: any = rendered.first().shallow();

        expect(flipper.prop("tabIndex")).toEqual(-1);
    });

    test("should set an attribute of `aria-hidden` to true if `visibility` prop is false", () => {
        const props: IFlipperHandledProps = {
            visible: false
        };

        const rendered: any = shallow(
            <Component {...props} />
        );

        const flipper: any = rendered.first().shallow();

        expect(flipper.prop("aria-hidden")).toEqual(true);
    });
\
    test("should not set an attribute of `aria-label` if no label is passed", () => {
        const props: IFlipperHandledProps = {
            visible: false
        };

        const rendered: any = shallow(
            <Component {...props} />
        );

        const flipper: any = rendered.first().shallow();

        expect(flipper.prop("aria-label")).toBe(undefined);
    });

    test("should set an attribute of `aria-label` if `label` prop is passed", () => {
        const props: IFlipperHandledProps = {
            visible: true,
            label: "Test aria-label"
        };

        const rendered: any = shallow(
            <Component {...props} />
        );

        const flipper: any = rendered.first().shallow();

        expect(flipper.instance().props.label).toBe("Test aria-label");
        expect(flipper.prop("aria-label")).toBe("Test aria-label");
    });
});
