import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    ButtonHTMLTags,
    ButtonProps,
    IButtonClassNameContract,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps
} from "./button";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("button", (): void => {
    generateSnapshots(examples);
});

describe("button unit-tests", (): void => {
    const Component: React.ComponentClass<IButtonHandledProps & IButtonManagedClasses> = examples.component;
    const managedClasses: IButtonClassNameContract = {
        button: "test-button"
    };
    const href: string = "https://www.microsoft.com";

    test("should return an object that includes all valid props which are note enumarated as handledProps", () => {
        const handledProps: IButtonHandledProps & IButtonManagedClasses = {
            managedClasses
        };

        const unhandledProps: IButtonUnhandledProps = {
            "aria-hidden": true
        };

        const props: ButtonProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should render by default as a `button` element", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        expect(rendered.type()).toBe("button");
    });

    test("should render as an `anchor` element if the `href` prop is passed", () => {
        const rendered: any = shallow(
            <Component href={href} managedClasses={managedClasses} />
        );

        expect(rendered.type()).toBe("a");
    });

    test("should render `aria-disabled` if `href` and `disabled` props are passed", () => {
        const rendered: any = shallow(
            <Component href={href} managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.prop("disabled")).toBe(undefined);
        expect(rendered.prop("aria-disabled")).toBe(true);
    });

    test("should render `disabled` if the `disabled` prop is passed and the href prop is not passed", () => {
        const rendered: any = shallow(
            <Component disabled={true} managedClasses={managedClasses} />
        );

        expect(rendered.prop("aria-disabled")).toBe(undefined);
        expect(rendered.prop("disabled")).toBe(true);
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses}>
                Children
            </Component>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
