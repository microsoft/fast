/* tslint:disable:no-console */
import React = require("react");
import renderer = require("react-test-renderer");

export interface IExampleProps {
    component: React.ReactNode;
    data: any;
    styles: string;
}

export interface IExample {
    title: string;
    props?: IExampleProps;
    children?: React.ReactNode;
}

export interface IExampes {
    data: IExample[];
}

/**
 * Automates taking snapshot tests from code examples.
 * @param {Array} examples - a set of example objects that contain a title, a
 * @param {Function} reactComponent - The react component to render
 * react component, props for that component, and children for that component
 */
export default (examples: IExampes, reactComponent: React.ComponentClass<any>): void => {
    if (!reactComponent) {
        console.error("No component param passed to generateSnapshots.");
        return;
    }

    if (!examples) {
        console.error("No examples param passed to generateSnapshots.");
        return;
    }

    if (!examples.data.length) {
        console.warn(
            "No examples found - ensure your example exports an object with a `data` member containing an array of component examples."
        );
    }

    for (const example of examples.data) {
        test(example.title, (): void => {
            const component: any = renderer.create(
                React.createElement(reactComponent, example.props, example.children)
            );

            const json: any = component.toJSON();

            expect(json).toMatchSnapshot();
        });
    }
};
