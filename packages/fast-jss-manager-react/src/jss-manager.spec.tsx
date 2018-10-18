import * as React from "react";
import { JSSManager } from "./jss-manager";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { configure, mount, ReactWrapper, render, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { jss, stylesheetRegistry } from "./jss";
import { DesignSystemProvider } from "./design-system-provider";

configure({ adapter: new Adapter() });

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
    interface TestDesignSystem {
        color: string;
    }

    function renderChild(): string {
        return "children";
    }

    // JSS doesn't export their StyleSheet class, so we can compile a stylesheet and
    // access it's constructor to get a reference to the StyleSheet class.
    const StyleSheet: any = jss.createStyleSheet({}).constructor;

    const stylesheet: any = {
        class: {
            color: (config: TestDesignSystem): string => {
                return config.color;
            },
        },
    };

    const testDesignSystem: TestDesignSystem = {
        color: "red",
    };

    function functionStyleSheet(config: TestDesignSystem): any {
        return {
            class: {
                color: config.color,
            },
        };
    }

    test("should not throw when no stylesheet is provided", (): void => {
        expect(
            (): void => {
                mount(<JSSManager render={renderChild} />);
            }
        ).not.toThrow();
    });

    test("should not throw when no stylesheet is provided and design system is changed", (): void => {
        const rendered: ReactWrapper = mount(
            <JSSManager designSystem={testDesignSystem} render={renderChild} />
        );

        expect(
            (): void => {
                rendered.setProps({ designSystem: { color: "blue" } });
            }
        ).not.toThrow();
    });

    test("should compile a stylesheet when mounting", (): void => {
        const objectStylesheetComponent: ReactWrapper = mount(
            <JSSManager
                render={renderChild}
                designSystem={testDesignSystem}
                styles={stylesheet}
            />
        );

        const functionStylesheetComponent: ReactWrapper = mount(
            <JSSManager
                render={renderChild}
                styles={functionStyleSheet}
                designSystem={testDesignSystem}
            />
        );

        expect(objectStylesheetComponent.state("styleSheet")).toBeInstanceOf(StyleSheet);
        expect(objectStylesheetComponent.state("styleSheet").attached).toBe(true);

        expect(functionStylesheetComponent.state("styleSheet")).toBeInstanceOf(
            StyleSheet
        );
        expect(functionStylesheetComponent.state("styleSheet").attached).toBe(true);
    });

    test("should update an object stylesheet when the design-system changes", (): void => {
        const objectStylesheetComponent: ReactWrapper = mount(
            <JSSManager
                designSystem={{ color: "blue" }}
                styles={stylesheet}
                render={renderChild}
            />
        );

        const functionStylesheetComponent: ReactWrapper = mount(
            <JSSManager
                designSystem={{ color: "blue" }}
                styles={functionStyleSheet}
                render={renderChild}
            />
        );

        const mock: any = jest.fn();

        objectStylesheetComponent.state("styleSheet").update = mock;
        objectStylesheetComponent.setProps({ designSystem: testDesignSystem });

        expect(mock.mock.calls).toHaveLength(1);
        expect(mock.mock.calls[0][0]).toEqual(testDesignSystem);

        const functionSheet: any = functionStylesheetComponent.state("styleSheet");
        functionStylesheetComponent.setProps({
            designSystem: testDesignSystem,
        });

        // Function stylesheets must be completely re-generated when the design-system changes,
        // so check identity
        expect(functionStylesheetComponent.state("styleSheet")).not.toBe(functionSheet);
    });

    test("should remove stylesheets when unmounting", (): void => {
        const objectStylesheetComponent: ReactWrapper = mount(
            <JSSManager
                designSystem={{ color: "red" }}
                styles={stylesheet}
                render={renderChild}
            />
        );

        const functionStylesheetComponent: ReactWrapper = mount(
            <JSSManager
                designSystem={{ color: "red" }}
                styles={stylesheet}
                render={renderChild}
            />
        );

        const objectSheet: any = objectStylesheetComponent.state("styleSheet");
        const functionSheet: any = functionStylesheetComponent.state("styleSheet");

        expect(objectSheet.attached).toBe(true);
        expect(functionSheet.attached).toBe(true);

        objectStylesheetComponent.unmount();
        functionStylesheetComponent.unmount();

        expect(objectSheet.attached).toBe(false);
        expect(functionSheet.attached).toBe(false);
    });

    test("should create a new stylesheet when stylesheet props are changed", () => {
        const rendered: any = shallow(
            <JSSManager
                styles={stylesheet}
                designSystem={testDesignSystem}
                render={renderChild}
            />
        );

        const sheet: any = rendered.state("styleSheet");

        rendered.setProps({ jssStyleSheet: { class: { color: "blue" } } });

        expect(rendered.state("styleSheet")).not.toBe(sheet);
    });

    test("should store all stylesheets in the registry", (): void => {
        stylesheetRegistry.reset();
        expect(stylesheetRegistry.registry.length).toBe(0);

        const rendered: any = shallow(
            <JSSManager
                styles={stylesheet}
                designSystem={testDesignSystem}
                render={renderChild}
            />
        );

        expect(stylesheetRegistry.registry.length).toBe(1);
    });

    test("should render a parent with a higher index than a child", (): void => {
        function renderChildJSSManager(): React.ReactNode {
            return (
                <JSSManager
                    styles={stylesheet}
                    designSystem={testDesignSystem}
                    render={renderChild}
                />
            );
        }

        const rendered: any = mount(
            <JSSManager
                styles={stylesheet}
                designSystem={testDesignSystem}
                render={renderChildJSSManager}
            />
        );

        expect(rendered.instance().index).toBeGreaterThan(
            rendered.children().instance().index
        );
    });
});
