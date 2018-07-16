import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
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
    let Component: React.ComponentClass<IButtonHandledProps & IButtonManagedClasses>;
    let managedClasses: IButtonClassNameContract;
    const testClassName: string = "test-button";
    const href: string = "https://www.microsoft.com";

    beforeEach(() => {
        Component = examples.component;
        managedClasses = {
            button: testClassName
        };
    });

    test("should render by default as a `button` element", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        expect(rendered.html()).toBe(`<button class="${testClassName}"></button>`);
    });

    test("should render as an `anchor` element if the `href` prop is passed", () => {
        const rendered: any = shallow(
            <Component href={href} managedClasses={managedClasses} />
        );

        expect(rendered.html()).toBe(`<a class="${testClassName}" href="${href}"></a>`);
    });

    test("should render `aria-disabled` if `href` and `disabled` props are passed", () => {
        const rendered: any = shallow(
            <Component href={href} managedClasses={managedClasses} disabled={true} />
        );

        expect(rendered.html()).toBe(`<a class="${testClassName}" href="${href}" aria-disabled="true"></a>`);
    });

    test("should render `disabled` if the `disabled` prop is passed and the href prop is not passed", () => {
        const rendered: any = shallow(
            <Component disabled={true} managedClasses={managedClasses} />
        );

        expect(rendered.html()).toBe(`<button class="${testClassName}" disabled=""></button>`);
    });

    test("should correctly render children", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses}>
                Children
            </Component>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });

    test("should correctly manage unhandledProps", () => {
        const handledProps: IButtonHandledProps & IButtonManagedClasses = {
            managedClasses
        };

        const unhandledProps: IButtonUnhandledProps = {
            "aria-label": "Test aria label"
        };

        const props: ButtonProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-label"]).not.toBe(undefined);
        expect(rendered.props()["aria-label"]).toEqual("Test aria label");
    });
});
