import * as React from "react";
import manageJss, { ComponentStyles } from "./manage-jss";
import * as ShallowRenderer from "react-test-renderer/shallow";

// Disable "no-string-literal" so we can access private members easily
/* tslint:disable:no-string-literal */

class SimpleComponent extends React.Component<any, any> {
    public render(): boolean {
        return true;
    }
}

const staticStyles: ComponentStyles<any> = {
    staticStyleClass: {
        color: "red"
    }
};

const dynamicStyles: ComponentStyles<any> = {
    dynamicStylesClass: {
        background: (): string => {
            return "blue";
        }
    }
};

const staticAndDynamicStyles: ComponentStyles<any> = {
    staticAndDynamicStylesClass: Object.assign({}, staticStyles.staticStyleClass, dynamicStyles.dynamicStylesClass)
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
    test("should share the static portion of a stylesheet and not share the dynamic portion of a stylesheeets across component instances", (): void => {
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
});
