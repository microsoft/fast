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
    class NoStylesManager extends JSSManager<any, any, any> {
        protected styles: void = undefined;
        protected managedComponent: React.ComponentType<any> = SimpleComponent;
    }

    class StyledManager extends JSSManager<any, any, any> {
        protected styles: any = staticAndDynamicStyles;
        protected managedComponent: React.ComponentType<any> = StyledComponent;
    }

    test("should render the managedComponent", () => {
        const rendered: any = mount(<NoStylesManager />);

        expect(rendered.find("div")).toHaveLength(1);
        expect(rendered.find("SimpleComponent")).toHaveLength(1);
    });

    test("should pass props to managed component", (): void => {
        const rendered: any = mount(<NoStylesManager id="id" />);

        expect(rendered.find("SimpleComponent").prop("id")).toBe("id");
    });

    test("should not pass the jssStyleSheet prop to managed component", (): void => {
        const rendered: any = mount(
            <NoStylesManager jssStyleSheet={{ foo: { color: "red" } }} />
        );

        expect(rendered.find("SimpleComponent").prop("jssStyleSheet")).toBeUndefined();
    });

    test("should create jssStyleSheet with more specificity than the composed stylesheet", (): void => {
        const context: any = { color: "red" };
        const rendered: any = mount(
            <StyledManager jssStyleSheet={{ foo: { color: "green" } }} />
        );
        const manager: any = rendered.find("StyledManager").instance();

        expect(manager.secondaryStyleSheet().options.index).toBeGreaterThan(
            manager.primaryStyleSheet().options.index
        );
    });

    test("should create subsequent jssStyleSheet sheets with more specificity than a composed stylesheet", (): void => {
        const context: any = { color: "red" };
        const rendered: any = mount(
            <React.Fragment>
                <StyledManager jssStyleSheet={{ foo: { color: "green" } }} />
                <StyledManager jssStyleSheet={{ foo: { color: "green" } }} />
                <StyledManager jssStyleSheet={{ foo: { color: "green" } }} />
            </React.Fragment>
        );

        const manager: any = rendered
            .find("StyledManager")
            .at(0)
            .instance();
        const managerTwo: any = rendered
            .find("StyledManager")
            .at(1)
            .instance();
        const managerThree: any = rendered
            .find("StyledManager")
            .at(2)
            .instance();

        expect(managerTwo.primaryStyleSheet().options.index).toBe(
            manager.primaryStyleSheet().options.index
        );
        expect(managerThree.primaryStyleSheet().options.index).toBe(
            manager.primaryStyleSheet().options.index
        );

        expect(manager.secondaryStyleSheet().options.index).toBeGreaterThan(
            manager.primaryStyleSheet().options.index
        );

        expect(managerTwo.secondaryStyleSheet().options.index).toBe(
            manager.secondaryStyleSheet().options.index
        );
        expect(managerThree.secondaryStyleSheet().options.index).toBe(
            managerTwo.secondaryStyleSheet().options.index
        );
    });

    test("should decrease a counter tracking global stylesheet order on mount", (): void => {
        const preMountIndex: number = (StyledManager as any).index;
        const rendered: any = mount(<StyledManager />);
        const manager: any = rendered.find("StyledManager").instance();

        expect(manager.index).toBe(preMountIndex - 1);
        expect((StyledManager as any).index).toBe(manager.index);
    });

    test("should increase a counter tracking global stylesheet order on unmount", (): void => {
        const rendered: any = mount(<StyledManager />);
        const manager: any = rendered.find("StyledManager").instance();
        const preUnmountIndex: number = (StyledManager as any).index;

        expect(manager.index).toBe(preUnmountIndex);

        rendered.unmount();

        expect((StyledManager as any).index).toBe(preUnmountIndex + 1);
    });

    test("should not pass the managedClasses prop through to managed component", (): void => {
        const managedClasses: any = { foo: "foo" };
        const rendered: any = mount(<NoStylesManager managedClasses={managedClasses} />);

        expect(rendered.find("SimpleComponent").prop("managedClasses")).not.toEqual(
            managedClasses
        );
    });

    test("should provide an empty object to the managedClasses prop if no styles are provided", (): void => {
        const rendered: any = mount(<NoStylesManager />);

        expect(rendered.find("SimpleComponent").prop("managedClasses")).toEqual({});
    });

    test("should have a default context if no context is provided", (): void => {
        const rendered: any = mount(<NoStylesManager managedClasses={{ foo: "foo" }} />);

        expect(rendered.instance().context).toEqual({});
    });

    test("should have a default context that shares identity between component instances", (): void => {
        const renderedOne: any = mount(
            <NoStylesManager managedClasses={{ foo: "foo" }} />
        );
        const renderedTwo: any = mount(
            <NoStylesManager managedClasses={{ foo: "bar" }} />
        );

        expect(renderedOne.instance().context).toBe(renderedTwo.instance().context);
    });

    test("should have a default context that increments between component instances", (): void => {
        const context: any = { foreground: "blue" };

        const rendered: any = mount(
            <DesignSystemProvider designSystem={context}>
                <NoStylesManager managedClasses={{ foo: "bar" }} />;
                <NoStylesManager managedClasses={{ foo: "foo" }} />;
            </DesignSystemProvider>
        );

        expect(
            rendered
                .find("NoStylesManager")
                .at(0)
                .instance().context
        ).toBe(
            rendered
                .find("NoStylesManager")
                .at(1)
                .instance().context
        );
    });

    test("should render a parent with a higher index than a child", (): void => {
        const rendered: any = mount(
            <NoStylesManager>
                <NoStylesManager />
            </NoStylesManager>
        );

        expect(rendered.instance().index).toBeGreaterThan(
            rendered
                .children()
                .find("NoStylesManager")
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
