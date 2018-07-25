import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ButtonHTMLTags } from "@microsoft/fast-components-react-base";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ButtonAppearance,
    ButtonProps,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps,
    IMSFTButtonClassNameContract
} from "./button";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("button snapshots", (): void => {
    generateSnapshots(examples);
});

describe("button", (): void => {
    const Component: React.ComponentClass<IButtonHandledProps> = examples.component;

    const href: string = "https://www.microsoft.com";

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IButtonHandledProps = {
            href
        };

        const unhandledProps: IButtonUnhandledProps = {
            "aria-hidden": true
        };

        const props: IButtonHandledProps & IButtonUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const button: any = rendered.first().shallow();

        expect(button.prop("aria-hidden")).toEqual(true);
    });

    /* tslint:disable-next-line */
    test("should set a className that matches button_primary managedClass when ButtonAppearance.primary is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.primary
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button_primary;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.primary);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should set a className that matches button_outline managedClass when ButtonAppearance.outline is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.outline
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button_outline;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.outline);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should set a className that matches button_lightweight managedClass when ButtonAppearance.lightweight is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.lightweight
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button_lightweight;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.lightweight);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should set a className that matches button_justified managedClass when ButtonAppearance.justified is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.justified
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button_justified;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.justified);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    test("should not set a className when appearance prop is not passed", () => {
        const rendered: any = shallow(
            <Component />
        );

        const button: any = rendered.first().shallow();

        expect(button.prop("className")).toEqual(undefined);
    });
});
