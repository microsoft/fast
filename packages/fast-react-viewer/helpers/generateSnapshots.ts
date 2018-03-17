import React = require("react");
import renderer = require("react-test-renderer");

/**
 * @name generateSnapshots
 * @description Automates taking snapshot tests from code examples.
   @param {Array} examples - a set of example objects that contain a title, a
   @param {Function} reactComponent - The react component to render
   react component, props for that component, and children for that component
 */
const generateSnapshots = (examples, reactComponent) => {
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

    for (let i = 0; i < examples.data.length; i++) {
        const example = examples.data[i];

        test(example.title, () => {
            const component = renderer.create(
                React.createElement(reactComponent, example.props, example.children)
            );

            const json = component.toJSON();

            expect(json).toMatchSnapshot();
        });
    }
};

export default generateSnapshots;
