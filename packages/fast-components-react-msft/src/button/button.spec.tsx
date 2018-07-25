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
    IButtonUnhandledProps
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
            <Component {...props} />
        );

        const button: any = rendered.first().shallow();

        expect(button.prop("aria-hidden")).toEqual(true);
    });

    // DO this for each type and check for null
    test("", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.primary
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const button: any = rendered.first().shallow();

        // Check to make sure prop is correct
        expect(button.prop("appearance")).toEqual(ButtonAppearance.primary);
        // Make sure its setting the class
        // way to check for dynamically gebnrated class with enzym
        expect(button.hasClass("button_primary")).toBe(true);
    });

    // If appearance is not being set
    test("If ", () => {
        const rendered: any = shallow(
            <Component />
        );

        const button: any = rendered.first().shallow();

        // Check to make sure prop is correct
        expect(button.prop("appearance")).toEqual(undefined);
    });
});
