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
    data: T[];
}

/**
 * Executes a single snapshot test given a component, component props, and a test title
 */
export function renderSnapshot<T>(props: T, component: React.ComponentClass<T>, title: string): void {
    test(title, (): void => {
        const renderedComponent = renderer.create(React.createElement(component, props));
        const componentJson = renderedComponent.toJSON();

        expect(componentJson).toMatchSnapshot();
    });
}

/**
 * Generate a set of snapshot tests given a snapshot suite
 */
export function generateSnapshots<T>(examples: ISnapshotTestSuite<T>): void {
    const data: T[] = examples.data;
    const component: React.ComponentClass<T> = examples.component;

    if (Array.isArray(data)) {
        data.forEach((example: T, index: number): void => {
            renderSnapshot(example, component, `${examples.name}: ${index}`);
        });
    }
}
