import * as React from "react";
import manageJss, {
    cleanLowerOrderComponentProps,
    IJSSManagerProps,
    JSSManager
} from "./manage-jss";
import jss, { stylesheetRegistry } from "./jss";
import { ComponentStyles, ComponentStyleSheetResolver } from "@microsoft/fast-jss-manager";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { configure, mount, ReactWrapper, render, shallow } from "enzyme";
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

/**
 * JSS stylesheet with static and dynamic values for CSS properties
 */
const staticAndDynamicStyles: ComponentStyles<any, any> = {
    staticAndDynamicStylesClass: { ...staticStyles.staticStyleClass, ...dynamicStyles.dynamicStylesClass }
};

describe("manageJss", (): void => {
    test("should return a  function", (): void => {
         expect(typeof manageJss()).toBe("function");
    });

    test("should return a function that returns react stateless component", (): void => {
        const hoc: React.SFC<{}> = manageJss()(SimpleComponent);

        expect(typeof hoc).toEqual("function");

        // Should expect a single prop argument
        expect(hoc.length).toBe(1);
    });
});

describe("cleanLowerOrderComponentProps", (): void => {
    test("should filter out jssStyleSheet and managedClasses", (): void => {
        const props: any = {
            managedClasses: {},
            jssStyleSheet: {},
            foobar: "success"
        };

        const result: any = cleanLowerOrderComponentProps(props);
        expect(result.managedClasses).toBe(undefined);
        expect(result.jssStyleSheet).toBe(undefined);
        expect(result.foobar).toBe("success");
    });
});

describe("The JSSManager", (): void => {
    function renderChild(): string {
        return "children";
    }

    // JSS doesn't export their StyleSheet class, so we can compile a stylesheet and
    // access it's constructor to get a reference to the StyleSheet class.
    const StyleSheet: any = jss.createStyleSheet({}).constructor;

    test("should not throw when no stylesheet is provided", (): void => {

        expect((): void => {
            mount(
                <JSSManager render={renderChild} />
            );
        }).not.toThrow();
    });

    test("should compile a stylesheet when mounting", (): void => {
        const tree: ReactWrapper = mount(
            <JSSManager
                render={renderChild}
                styles={{ className: { color: "red" } }}
            />
        );

        expect(tree.state("styleSheet")).toBeInstanceOf(StyleSheet);
    });

    xtest("should return a different component when called twice with the same component", (): void => {
        expect(manageJss()(SimpleComponent)).not.toBe(manageJss()(SimpleComponent));
    });

    xtest("should not share static styles across component instances", (): void => {
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
    xtest("should not share the static portion or the dynamic portion of a stylesheets across component instances", (): void => {
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

    xtest("should update the stylesheet when context changes", (): void => {
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

    xtest("should remove stylesheets when unmounting" , (): void => {
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

    xtest("should create a new stylesheet when stylesheet props are changed", () => {
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

    xtest("should accept a function as a stylesheet", () => {
        const Component: any = manageJss(stylesheetResolver)(SimpleComponent);
        const rendered: any = shallow(
            <Component />
        );

        const styleSheet: any = rendered.state("styleSheet");

        expect(styleSheet.attached).toBe(true);
        expect(styleSheet.classes.resolvedStylesClass).not.toBe(undefined);
    });

    xtest("should store all stylesheets in the registry", (): void => {
        stylesheetRegistry.reset();
        expect(stylesheetRegistry.registry.length).toBe(0);

        const Component: any = manageJss(staticAndDynamicStyles)(SimpleComponent);
        const rendered: any = shallow(
            <Component />
        );

        expect(stylesheetRegistry.registry.length).toBe(1);
    });
});
