import * as React from "react";
import { JSSManager } from "./jss-manager";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { configure, mount, ReactWrapper, render, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { jss, stylesheetRegistry } from "./jss";
import { DesignSystemProvider } from "./design-system-provider";
import { values } from "lodash-es";

configure({ adapter: new Adapter() });
/* tslint:disable:max-classes-per-file */

/**
 * JSS stylesheet with only static values for CSS properties
 */
const staticStyles: ComponentStyles<any, any> = {
    staticStyleClass: {
        color: "red",
    },
};

/**
 * JSS stylesheet with dynamic values for CSS properties
 */
const dynamicStyles: ComponentStyles<any, any> = {
    dynamicStylesClass: {
        background: (): string => {
            return "blue";
        },
    },
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
            },
        },
    };
};

class SimpleComponent extends React.Component<any, {}> {
    public render(): JSX.Element {
        return <div id={this.props.id} children={this.props.children} />;
    }
}

class StyledComponent extends React.Component<any, {}> {
    public render(): JSX.Element {
        return <div className={this.renderClasses()} />;
    }

    private renderClasses(): string {
        return values(this.props.managedClasses).join(" ");
    }
}

/**
 * JSS stylesheet with static and dynamic values for CSS properties
 */
const staticAndDynamicStyles: ComponentStyles<any, any> = {
    staticAndDynamicStylesClass: {
        ...staticStyles.staticStyleClass,
        ...dynamicStyles.dynamicStylesClass,
    },
};

describe("The JSSManager", (): void => {
    class NoPropsManager extends JSSManager<any, any, any> {
        protected styles: void = undefined;
        protected managedComponent: React.ComponentType<any> = SimpleComponent;
    }

    class StyledManager extends JSSManager<any, any, any> {
        protected styles: any = staticAndDynamicStyles;
        protected managedComponent: React.ComponentType<any> = StyledComponent;
    }

    test("should render the managedComponent", () => {
        const rendered: any = mount(<NoPropsManager />);

        expect(rendered.find("div")).toHaveLength(1);
        expect(rendered.find("SimpleComponent")).toHaveLength(1);
    });

    test("should pass props to managed component", (): void => {
        const rendered: any = mount(<NoPropsManager id="id" />);

        expect(rendered.find("SimpleComponent").prop("id")).toBe("id");
    });

    test("should not pass the jssStyleSheet prop to managed component", (): void => {
        const rendered: any = mount(
            <NoPropsManager jssStyleSheet={{ foo: { color: "red" } }} />
        );

        expect(rendered.find("SimpleComponent").prop("jssStyleSheet")).toBeUndefined();
    });

    test("should not pass the managedClasses prop through to managed component", (): void => {
        const managedClasses: any = { foo: "foo" };
        const rendered: any = mount(<NoPropsManager managedClasses={managedClasses} />);

        expect(rendered.find("SimpleComponent").prop("managedClasses")).not.toEqual(
            managedClasses
        );
    });

    test("should provide an empty object to the managedClasses prop if no styles are provided", (): void => {
        const rendered: any = mount(<NoPropsManager />);

        expect(rendered.find("SimpleComponent").prop("managedClasses")).toEqual({});
    });

    test("should have a default context if no context is provided", (): void => {
        const rendered: any = mount(<NoPropsManager managedClasses={{ foo: "foo" }} />);

        expect(rendered.instance().context).toEqual({});
    });

    test("the default context should share identity between component instances", (): void => {
        const renderedOne: any = mount(
            <NoPropsManager managedClasses={{ foo: "foo" }} />
        );
        const renderedTwo: any = mount(
            <NoPropsManager managedClasses={{ foo: "bar" }} />
        );

        expect(renderedOne.instance().context).toBe(renderedTwo.instance().context);
    });

    test("the default context should share identity between component instances", (): void => {
        const context: any = { foreground: "blue" };

        const rendered: any = mount(
            <DesignSystemProvider designSystem={context}>
                <NoPropsManager managedClasses={{ foo: "bar" }} />;
                <NoPropsManager managedClasses={{ foo: "foo" }} />;
            </DesignSystemProvider>
        );

        expect(
            rendered
                .find("NoPropsManager")
                .at(0)
                .instance().context
        ).toBe(
            rendered
                .find("NoPropsManager")
                .at(1)
                .instance().context
        );
    });

    test("should render a parent with a higher index than a child", (): void => {
        const rendered: any = mount(
            <NoPropsManager>
                <NoPropsManager />
            </NoPropsManager>
        );

        expect(rendered.instance().index).toBeGreaterThan(
            rendered
                .children()
                .find("NoPropsManager")
                .instance().index
        );
    });

    test("should apply managedClasses when rendered with styles", (): void => {
        const rendered: any = mount(<StyledManager />);

        expect(rendered.find("div").prop("className")).toMatch(
            "staticAndDynamicStylesClass"
        );
    });
    test("should combine managedClasses when rendered with styles and jssStyleSheet", (): void => {
        const rendered: any = mount(
            <StyledManager jssStyleSheet={{ instanceStyle: { color: "red" } }} />
        );

        expect(rendered.find("div").prop("className")).toMatch("instanceStyle");
        expect(rendered.find("div").prop("className")).toMatch(
            "staticAndDynamicStylesClass"
        );
    });

    test("should remove the stylesheet on unmount", (): void => {
        const rendered: any = mount(<StyledManager />);
    });
});
/* tslint:enable:max-classes-per-file */
