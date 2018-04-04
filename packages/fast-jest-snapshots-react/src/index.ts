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
     * An array of prop instances for the component
     */
    data: T[];
}

/**
 * Executes a single snapshot test given a component, component data, and a test title
 */
export function renderSnapshot<T>(data: T, component: React.ComponentClass<T>, title: string): void {
    test(title, (): void => {
        const renderedComponent: any = renderer.create(React.createElement(component, data));
        const componentJson: JSON = renderedComponent.toJSON();

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
