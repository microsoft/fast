import * as React from "react";
import manageJss from "./manage-jss";
import { ComponentStyles, ComponentStyleSheetResolver } from "@microsoft/fast-jss-manager";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { configure, mount, render, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

// Disable "no-string-literal" so we can access private members easily
/* tslint:disable:no-string-literal */

class SimpleComponent extends React.Component<any, any> {
    public render(): boolean {
        return true;
    }
}

/**
 * JSS stylesheet with only static values for CSS properties
 */
const staticStyles: ComponentStyles<any, any> = {
    staticStyleClass: {
        color: "red"
    }
};

/**
 * JSS stylesheet with dynamic values for CSS properties
 */
const dynamicStyles: ComponentStyles<any, any> = {
    dynamicStylesClass: {
        background: (): string => {
            return "blue";
        }
    }
};

/**
 * JSS stylesheet defined as a function
 */
const stylesheetResolver: ComponentStyles<any, any> = (config: any): any => {
    return {
        resolvedStylesClass: {
            background: "green",
            color: (): string => {
                return "yellow";
            }
        }
    };
};

const staticAndDynamicStyles: ComponentStyles<any, any> = {
    staticAndDynamicStylesClass: { ...staticStyles.staticStyleClass, ...dynamicStyles.dynamicStylesClass }
};

describe("The return value of manageJss", (): void => {
    test("should return a higher order function", (): void => {
         expect(typeof manageJss()).toBe("function");
    });

    test("should return a higher order function that returns a higher-order component", (): void => {

        expect(manageJss()(SimpleComponent).prototype.isReactComponent).toEqual({});
    });
});

describe("The higher-order component", (): void => {

    test("should return a different component when called twice with the same component", (): void => {
        expect(manageJss()(SimpleComponent)).not.toBe(manageJss()(SimpleComponent));
    });

    test("should share a stylesheet manager between instances", (): void => {
        const key: string = "stylesheetManager";
        expect( manageJss()(SimpleComponent)[key]).toBe(manageJss()(SimpleComponent)[key]);
    });

    test("should not share static styles across component instances", (): void => {
        const renderers: ShallowRenderer[] = [
            new ShallowRenderer(),
            new ShallowRenderer()
        ];
        const Component: any = manageJss(staticStyles)(SimpleComponent);
        const expected: number = 0;

        renderers.forEach((renderer: ShallowRenderer) => {
            renderer.render(<Component />);
        });

        expect(Component["stylesheetManager"].sheets.length).toBe(expected);
    });
    // tslint:disable-next-line
    test("should not share the static portion or the dynamic portion of a stylesheets across component instances", (): void => {
        const renderers: ShallowRenderer[] = [
            new ShallowRenderer(),
            new ShallowRenderer()
        ];
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const expected: number = 0;

        renderers.forEach((renderer: ShallowRenderer) => {
            renderer.render(<Component />);
        });

        expect(Component["stylesheetManager"].sheets.length).toBe(expected);
    });

    test("should update the stylesheet when context changes", (): void => {
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const mock: any = jest.fn();
        const rendered: any = shallow(
            <Component />,
            { context: {designSystem: true} }
        );
        rendered.instance().updateStyleSheet = mock;

        // Change context
        rendered.setContext({designSystem: false});

        expect(mock.mock.calls.length).toBe(1);
    });

    test("should remove stylesheets when unmounting" , (): void => {
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const rendered: any = shallow(
            <Component />,
            { context: {designSystem: true} }
        );
        const styleSheet: any = rendered.state("styleSheet");
        expect(styleSheet.attached).toBe(true);

        rendered.unmount();

        expect(styleSheet.attached).toBe(false);
    });

    test("should create a new stylesheet when stylesheet props are changed", () => {
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const rendered: any = shallow(
            <Component jssStyleSheet={{dynamicStylesClass: { margin: "0" }}} />,
            { context: {designSystem: true} }
        );

        const styleSheet: any = rendered.state("styleSheet");

        rendered.setProps({jssStyleSheet: {dynamicStylesClass: { margin: "1px" }}});

        expect(styleSheet.attached).toBe(false);
        expect(rendered.state("styleSheet").attached).toBe(true);
    });

    test("should accept a function as a stylesheet", () => {
        const Component: any = manageJss(stylesheetResolver)(SimpleComponent);
        const rendered: any = shallow(
            <Component />
        );

        const styleSheet: any = rendered.state("styleSheet");

        expect(styleSheet.attached).toBe(true);
        expect(styleSheet.classes.resolvedStylesClass).not.toBe(undefined);
    });
});
