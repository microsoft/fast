import * as React from "react";
import * as renderer from "react-test-renderer";

/**
 * An interface describing component example objects used for snapshots and component testing.
 */
export interface ISnapshotTestSuite<T> {
    /**
     * The name of the component
     */
    name: string;

    /**
     * The component constructor
     */
    component: React.ComponentClass<T>;

    /**
     * Prop instances to pass to a component
     */
    props: T[];
}

/**
 * Executes a single snapshot test given a component, component props, and a test title
 */
export function renderSnapshot<T>(props: T, component: React.ComponentClass<T>, title: string): void {
    test(title, (): void => {
        const renderedComponent: any = renderer.create(React.createElement(component, props));
        const componentJson: JSON = renderedComponent.toJSON();

        expect(componentJson).toMatchSnapshot();
    });
}

/**
 * Generate a set of snapshot tests given a snapshot suite
 */
export function generateSnapshots<T>(examples: ISnapshotTestSuite<T>): void {
    const props: T[] = examples.props;
    const component: React.ComponentClass<T> = examples.component;

    if (Array.isArray(props)) {
        props.forEach((example: T, index: number): void => {
            renderSnapshot(example, component, `${examples.name}: ${index}`);
        });
    }
}
