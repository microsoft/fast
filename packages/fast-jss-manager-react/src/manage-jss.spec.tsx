import * as React from "react";
import manageJss from "./manage-jss";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { shallow, mount, render, configure } from "enzyme";
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

const staticStyles: ComponentStyles<any, any> = {
    staticStyleClass: {
        color: "red"
    }
};

const dynamicStyles: ComponentStyles<any, any> = {
    dynamicStylesClass: {
        background: (): string => {
            return "blue";
        }
    }
};

const staticAndDynamicStyles: ComponentStyles<any, any> = {
    staticAndDynamicStylesClass: { ...staticStyles.staticStyleClass, ...dynamicStyles.dynamicStylesClass } 
};

// Because stylesheets are stored on a static property of manageJss"s HOC, we need to track how many have been created
// across all of our tests. This value should be updated for every time the HOC is rendered .
let stylesheetCount: number = 0;

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

    test("should share static stylesheets across component instances", (): void => {
        const renderers: ShallowRenderer[] = [
            new ShallowRenderer(),
            new ShallowRenderer()
        ];
        const Component: any = manageJss(staticStyles)(SimpleComponent);
        const expected: number = stylesheetCount += 1;

        renderers.forEach((renderer: ShallowRenderer) => {
            renderer.render(<Component />);
        });

        expect(Component["stylesheetManager"].sheets.length).toBe(expected);
    });
    // tslint:disable-next-line
    test("should share the static portion of a stylesheet and not share the dynamic portion of a stylesheets across component instances", (): void => {
        const renderers: ShallowRenderer[] = [
            new ShallowRenderer(),
            new ShallowRenderer()
        ];
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const expected: number = stylesheetCount += 1;

        renderers.forEach((renderer: ShallowRenderer) => {
            renderer.render(<Component />);
        });

        expect(Component["stylesheetManager"].sheets.length).toBe(expected);
    });

    test("should update the stylesheet when context changes", (): void => {
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const mock = jest.fn();
        const rendered = shallow(
            <Component />,
            { context: {designSystem: true} }
        );
        rendered.instance().updateDynamicStyleSheet = mock;
        
        // Change context
        rendered.setContext({designSystem: false});

        expect(mock.mock.calls.length).toBe(1);
    });

    test("should remove stylesheets when unmounting" , (): void => {
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const rendered = shallow(
            <Component />,
            { context: {designSystem: true} }
        );
        let staticStyleSheet = rendered.state("staticStyleSheet");
        let dynamicStyleSheet = rendered.state("dynamicStyleSheet");
        expect(staticStyleSheet.attached).toBe(true);
        expect(dynamicStyleSheet.attached).toBe(true);

        rendered.unmount();

        expect(staticStyleSheet.attached).toBe(false);
        expect(dynamicStyleSheet.attached).toBe(false);
    });

    test("should create a new stylesheet when stylesheet props are changed", () => {
        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const rendered = shallow(
            <Component jssStyleSheet={{dynamicStylesClass: { margin: "0" }}} />,
            { context: {designSystem: true} }
        );

        const dynamicStyleSheet = rendered.state("dynamicStyleSheet");

        rendered.setProps({jssStyleSheet: {dynamicStylesClass: { margin: "1" }}});

        expect(dynamicStyleSheet.attached).toBe(false);
        expect(rendered.state("dynamicStyleSheet").attached).toBe(true);
    });
});
